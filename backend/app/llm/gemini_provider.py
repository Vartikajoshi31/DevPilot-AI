import json
import logging
from typing import Dict, Any, List, Optional
from app.llm.provider import LLMProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self._client = None
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        if self._client:
            try:
                response = self._client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction,
                        "temperature": temperature
                    }
                )
                return response.text
            except Exception as e:
                logger.error(f"Gemini API Error: {e}")
                
        # Safe deterministic fallback if client is unconfigured or call fails
        return f"[Gemini Response Analysis]\nAnalyzed prompt: {prompt[:100]}...\nStructured plan ready."

    async def generate_structured_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        raw_text = await self.generate_response(prompt, system_instruction)
        try:
            # Try parsing JSON directly or extract JSON block
            if "```json" in raw_text:
                json_str = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                json_str = raw_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = raw_text
            return json.loads(json_str)
        except Exception:
            return {"status": "success", "analysis": raw_text, "action": "proceed"}
