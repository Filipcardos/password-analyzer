import math
import re
import secrets
import string
import hashlib
import httpx

COMMON_PATTERNS = [
    "123456", "password", "senha", "admin", "qwerty", "abc123",
    "letmein", "welcome", "monkey", "dragon", "master", "login",
    "111111", "000000", "123123", "iloveyou", "sunshine", "princess",
    "football", "shadow", "superman", "michael", "baseball",
]

KEYBOARD_SEQUENCES = ["qwerty", "asdf", "zxcv", "1234", "4321", "abcd"]


def get_charset_size(password: str) -> int:
    size = 0
    if re.search(r"[a-z]", password):
        size += 26
    if re.search(r"[A-Z]", password):
        size += 26
    if re.search(r"[0-9]", password):
        size += 10
    if re.search(r"[^a-zA-Z0-9]", password):
        size += 32
    return size


def calc_entropy(password: str) -> float:
    cs = get_charset_size(password)
    if cs == 0 or len(password) == 0:
        return 0.0
    return round(len(password) * math.log2(cs), 1)


def calc_score(password: str) -> int:
    score = 0
    score += min(len(password) * 4, 40)
    if re.search(r"[a-z]", password):
        score += 5
    if re.search(r"[A-Z]", password):
        score += 10
    if re.search(r"[0-9]", password):
        score += 10
    if re.search(r"[^a-zA-Z0-9]", password):
        score += 15

    lower = password.lower()
    for pattern in COMMON_PATTERNS:
        if pattern in lower:
            score -= 25
            break

    for seq in KEYBOARD_SEQUENCES:
        if seq in lower:
            score -= 10
            break

    if re.search(r"(.)\1{2,}", password):
        score -= 10

    entropy = calc_entropy(password)
    score += min(int(entropy / 2), 20)

    return max(0, min(100, score))


def get_strength_label(score: int) -> str:
    if score < 20:
        return "CRÍTICA"
    if score < 40:
        return "FRACA"
    if score < 60:
        return "MODERADA"
    if score < 80:
        return "FORTE"
    return "MUITO FORTE"


def get_crack_times(password: str) -> dict:
    cs = get_charset_size(password) or 1
    combinations = cs ** len(password)

    def fmt(seconds: float) -> str:
        if seconds < 1:
            return "instantâneo"
        if seconds < 60:
            return f"{int(seconds)} segundos"
        if seconds < 3600:
            return f"{int(seconds/60)} minutos"
        if seconds < 86400:
            return f"{int(seconds/3600)} horas"
        if seconds < 2_592_000:
            return f"{int(seconds/86400)} dias"
        if seconds < 31_536_000:
            return f"{int(seconds/2_592_000)} meses"
        if seconds < 31_536_000 * 100:
            return f"{int(seconds/31_536_000)} anos"
        if seconds < 31_536_000 * 1_000_000:
            return f"{int(seconds/31_536_000/1000)} mil anos"
        return "> 1 bilhão de anos"

    return {
        "online_attack": fmt(combinations / 100),
        "brute_force": fmt(combinations / 1_000_000_000),
        "gpu_cluster": fmt(combinations / 100_000_000_000),
        "asic_advanced": fmt(combinations / 1_000_000_000_000),
    }


def get_vulnerabilities(password: str) -> list[dict]:
    issues = []
    lower = password.lower()

    if len(password) < 8:
        issues.append({"label": "MUITO CURTA", "severity": "danger"})
    elif len(password) < 12:
        issues.append({"label": "CURTA", "severity": "warning"})

    if not re.search(r"[A-Z]", password):
        issues.append({"label": "SEM MAIÚSCULAS", "severity": "warning"})
    if not re.search(r"[0-9]", password):
        issues.append({"label": "SEM NÚMEROS", "severity": "warning"})
    if not re.search(r"[^a-zA-Z0-9]", password):
        issues.append({"label": "SEM CARACTERES ESPECIAIS", "severity": "warning"})
    if re.search(r"(.)\1{2,}", password):
        issues.append({"label": "CARACTERES REPETIDOS", "severity": "danger"})
    if re.match(r"^[a-zA-Z]+$", password):
        issues.append({"label": "SÓ LETRAS", "severity": "warning"})
    if re.match(r"^[0-9]+$", password):
        issues.append({"label": "SÓ NÚMEROS", "severity": "danger"})

    for pattern in COMMON_PATTERNS:
        if pattern in lower:
            issues.append({"label": "PADRÃO COMUM DETECTADO", "severity": "danger"})
            break

    for seq in KEYBOARD_SEQUENCES:
        if seq in lower:
            issues.append({"label": "SEQUÊNCIA DE TECLADO", "severity": "warning"})
            break

    if not issues:
        issues.append({"label": "SEM VULNERABILIDADES", "severity": "ok"})

    return issues


def check_pwned(password: str) -> dict:
    """
    Check HaveIBeenPwned API (k-anonymity model — never sends full password).
    Returns breach count and status.
    """
    try:
        sha1 = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
        prefix, suffix = sha1[:5], sha1[5:]
        response = httpx.get(
            f"https://api.pwnedpasswords.com/range/{prefix}",
            timeout=3.0,
            headers={"Add-Padding": "true"},
        )
        for line in response.text.splitlines():
            parts = line.split(":")
            if len(parts) == 2 and parts[0] == suffix:
                count = int(parts[1])
                return {"pwned": True, "breach_count": count}
        return {"pwned": False, "breach_count": 0}
    except Exception:
        return {"pwned": None, "breach_count": None, "error": "serviço indisponível"}


def analyze_password(password: str) -> dict:
    score = calc_score(password)
    entropy = calc_entropy(password)
    charset = get_charset_size(password)
    upper_count = len(re.findall(r"[A-Z]", password))
    lower_count = len(re.findall(r"[a-z]", password))
    digit_count = len(re.findall(r"[0-9]", password))
    special_count = len(re.findall(r"[^a-zA-Z0-9]", password))

    pwned = check_pwned(password)

    return {
        "score": score,
        "strength": get_strength_label(score),
        "entropy": entropy,
        "length": len(password),
        "charset_size": charset,
        "metrics": {
            "uppercase": upper_count,
            "lowercase": lower_count,
            "digits": digit_count,
            "special": special_count,
        },
        "vulnerabilities": get_vulnerabilities(password),
        "crack_times": get_crack_times(password),
        "pwned": pwned,
    }


def generate_strong_password(length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*-_=+?"
    while True:
        pw = "".join(secrets.choice(alphabet) for _ in range(length))
        # Ensure all character classes are present
        has_upper = any(c.isupper() for c in pw)
        has_lower = any(c.islower() for c in pw)
        has_digit = any(c.isdigit() for c in pw)
        has_special = any(c in "!@#$%^&*-_=+?" for c in pw)
        if has_upper and has_lower and has_digit and has_special:
            return pw
