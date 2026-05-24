import json
import os
import sys
from functools import lru_cache

import cohere
from dotenv import load_dotenv

load_dotenv()
COHERE_API_KEY = os.getenv("cohere_api_key")
co = cohere.ClientV2(COHERE_API_KEY)


def extract_text_from_content(content_list):
    texts = []
    for item in content_list:
        text = getattr(item, "text", "")
        if text:
            texts.append(text)
    return " ".join(texts).strip()


@lru_cache(maxsize=512)
def generate_description(tags: str) -> str:
    system_message = "You are a helpful assistant that writes natural and engaging product descriptions."
    user_message = (
        f"Write a detailed, natural, and factful 100-word product description in English "
        f"based on these features: {tags}. Use varied language and avoid repetition."
    )
    try:
        response = co.chat(
            model="command-xlarge-nightly",
            messages=[
        #type: ignore
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            max_tokens=150,
            temperature=0.75,
            stop_sequences=["--"],
        )
        content = response.message.content

        if isinstance(content, list):
            description = extract_text_from_content(content)
        elif isinstance(content, str):
            description = content.strip()
        else:
            description = str(content)

        return description

    except Exception as e:
        return f"Description generation failed: {str(e)}"


if __name__ == "__main__":
    input_tags = sys.argv[1] if len(sys.argv) > 1 else ""
    description = generate_description(input_tags)
    print(json.dumps({"description": description}))
