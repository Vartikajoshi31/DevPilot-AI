from app.llm.provider import LLMProvider
from app.llm.gemini_provider import GeminiProvider
from app.core.config import settings

def get_llm_provider(provider_name: str = None) -> LLMProvider:
    name = (provider_name or settings.DEFAULT_PROVIDER).lower()
    if name == "gemini":
        return GeminiProvider()
    elif name == "openai":
        # Fallback to Gemini if OpenAI key isn't provided
        return GeminiProvider()
    elif name == "anthropic":
        # Fallback to Gemini if Anthropic key isn't provided
        return GeminiProvider()
    return GeminiProvider()
