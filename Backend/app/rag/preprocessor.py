import re


_NUMBER_WORDS = {
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
    "ten": "10", "eleven": "11", "twelve": "12", "thirteen": "13",
    "fourteen": "14", "fifteen": "15", "sixteen": "16", "seventeen": "17",
    "eighteen": "18", "nineteen": "19", "twenty": "20", "thirty": "30",
    "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70",
    "eighty": "80", "ninety": "90", "hundred": "100", "thousand": "1000",
}

_SUPERSCRIPT_MAP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹", "0123456789")
_SUBSTRING_MAP = str.maketrans("₀₁₂₃₄₅₆₇₈₉", "0123456789")


def _words_to_digits(text: str) -> str:
    def _replace(match: re.Match) -> str:
        words = match.group(0).lower().split()
        result = []
        i = 0
        while i < len(words):
            if words[i] in _NUMBER_WORDS:
                base = int(_NUMBER_WORDS[words[i]])
                if i + 1 < len(words) and words[i + 1] in _NUMBER_WORDS:
                    nxt = int(_NUMBER_WORDS[words[i + 1]])
                    if 20 <= base < 100 and nxt < 10:
                        result.append(str(base + nxt))
                        i += 2
                        continue
                result.append(str(base))
            else:
                result.append(words[i])
            i += 1
        return " ".join(result)

    pattern = r"\b(?:" + "|".join(_NUMBER_WORDS.keys()) + r")(?:\s+(?:" + "|".join(_NUMBER_WORDS.keys()) + r"))*\b"
    return re.sub(pattern, _replace, text, flags=re.IGNORECASE)


def _digits_to_words(n: int) -> str | None:
    if n < 0 or n > 9999:
        return None
    ones = [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen",
    ]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

    if n < 20:
        return ones[n]
    if n < 100:
        return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")
    if n < 1000:
        remainder = _digits_to_words(n % 100)
        return ones[n // 100] + " hundred" + (" " + remainder if remainder else "")
    remainder = _digits_to_words(n % 1000)
    return ones[n // 1000] + " thousand" + (" " + remainder if remainder else "")


def normalize_text(text: str) -> str:
    text = text.lower()
    text = _words_to_digits(text)
    text = text.replace("×", "x")
    text = text.replace("µ", "u").replace("μ", "u")
    text = text.replace("–", "-").replace("—", "-")
    text = re.sub(r"(\d),(\d{3})", r"\1\2", text)
    text = re.sub(r"(\w+)/(\w+)", r"\1 per \2", text)
    text = re.sub(r"(\d)([⁰¹²³⁴⁵⁶⁷⁸⁹])", r"\1^\2", text)
    text = text.translate(_SUPERSCRIPT_MAP)
    text = text.translate(_SUBSTRING_MAP)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def expand_query(query: str) -> list[str]:
    normalized = normalize_text(query)
    variants = {normalized, query.lower()}

    for match in re.finditer(r"\b\d+\b", normalized):
        word_form = _digits_to_words(int(match.group(0)))
        if word_form:
            variants.add(normalized[:match.start()] + word_form + normalized[match.end():])

    return list(variants)
