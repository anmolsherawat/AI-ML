import os
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    farm_data: dict
    report: str

def analyze_farm_data(state: AgentState):
    """Analyzes the farm data and identifies risk factors."""
    farm_data = state["farm_data"]
    
    # Initialize the LLM with the recommended supported model
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)
    
    prompt = f"""
    You are an expert agronomist. Analyze the following farm conditions and identify potential risk factors.
    
    Farm Data:
    - Crop: {farm_data['crop']}
    - Country: {farm_data['country']}
    - Average Rainfall: {farm_data['rainfall']} mm/year
    - Average Temperature: {farm_data['temperature']} °C
    - Pesticides used: {farm_data['pesticides']} tonnes
    - Predicted Yield: {farm_data['predicted_yield']:.2f} hg/ha
    
    Provide a brief analysis of the weather, soil inputs, and potential risks for this crop in this region.
    """
    
    response = llm.invoke([SystemMessage(content="You are an agricultural expert AI."), HumanMessage(content=prompt)])
    
    return {"messages": [response]}

def generate_recommendations(state: AgentState):
    """Generates actionable farming recommendations."""
    farm_data = state["farm_data"]
    previous_analysis = state["messages"][-1].content
    
    # Initialize the LLM with the recommended supported model
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3)
    
    prompt = f"""
    Based on the following farm analysis, provide structured, actionable crop management recommendations.
    
    Analysis:
    {previous_analysis}
    
    Format the output EXACTLY as follows:
    
    ### Crop and Field Summary
    [Brief summary of the farm conditions]
    
    ### Yield Prediction Interpretation
    [Explain what the predicted yield means for the farmer]
    
    ### Identified Risk Factors
    [List 3-4 bullet points on risks like weather, soil, inputs]
    
    ### Recommended Farming Actions
    [List 3-4 specific, actionable steps the farmer should take (e.g., fertilizer optimization, irrigation planning)]
    
    ### Supporting Sources
    [Mention 1-2 general agronomy resources or guidelines relevant to this crop]
    
    ### Disclaimers
    *Agricultural Disclaimer:* This is AI-generated advice based on historical data. Please consult a local agronomist.
    """
    
    response = llm.invoke([SystemMessage(content="You are an agricultural expert AI."), HumanMessage(content=prompt)])
    
    return {"report": response.content}

def build_agent():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("analyze", analyze_farm_data)
    workflow.add_node("recommend", generate_recommendations)
    
    workflow.set_entry_point("analyze")
    workflow.add_edge("analyze", "recommend")
    workflow.add_edge("recommend", END)
    
    return workflow.compile()

def run_advisory_agent(crop, country, year, rainfall, pesticides, temperature, predicted_yield):
    farm_data = {
        "crop": crop,
        "country": country,
        "year": year,
        "rainfall": rainfall,
        "pesticides": pesticides,
        "temperature": temperature,
        "predicted_yield": predicted_yield
    }
    
    app = build_agent()
    
    inputs = {
        "messages": [],
        "farm_data": farm_data,
        "report": ""
    }
    
    result = app.invoke(inputs)
    return result["report"]
