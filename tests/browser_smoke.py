"""Optional Chromium check of the exact generated public pages."""

from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1] / "site"


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=["--no-sandbox", "--enable-unsafe-swiftshader"])
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors, network = [], []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("request", lambda request: network.append(request.url) if request.url.startswith(("http:", "https:")) else None)
        page.goto((SITE / "index.html").as_uri())
        assert page.locator("html").get_attribute("dir") == "rtl"
        assert "ראו את המקור" in page.locator("h1").inner_text()
        email_link = page.locator("#email-link")
        whatsapp_link = page.locator("#whatsapp-link")
        assert email_link.get_attribute("aria-disabled") is None
        assert whatsapp_link.get_attribute("aria-disabled") is None
        email_he = email_link.get_attribute("href")
        whatsapp_he = whatsapp_link.get_attribute("href")
        assert unquote(urlparse(email_he).path) == "eyalnof123@gmail.com"
        assert parse_qs(urlparse(email_he).query).get("subject")
        assert whatsapp_he.startswith("https://wa.me/972526746667?text=")
        assert parse_qs(urlparse(email_he).query).get("body")
        assert parse_qs(urlparse(whatsapp_he).query).get("text")
        for width in (360, 768, 1440):
            page.set_viewport_size({"width": width, "height": 900})
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator("#lang-en").click()
        assert page.locator("html").get_attribute("dir") == "ltr"
        assert "See the source" in page.locator("h1").inner_text()
        email_en = email_link.get_attribute("href")
        whatsapp_en = whatsapp_link.get_attribute("href")
        assert unquote(urlparse(email_en).path) == "eyalnof123@gmail.com"
        assert parse_qs(urlparse(email_en).query).get("subject")
        assert whatsapp_en.startswith("https://wa.me/972526746667?text=")
        assert parse_qs(urlparse(email_en).query)["body"] != parse_qs(urlparse(email_he).query)["body"]
        assert parse_qs(urlparse(whatsapp_en).query)["text"] != parse_qs(urlparse(whatsapp_he).query)["text"]
        page.locator(".card").nth(0).click()
        assert page.locator("html").get_attribute("lang") == "en"
        assert page.locator("#question").input_value() == "What does Evidence Workspace do?"
        assert page.locator(".answer-card:visible").count() == 1
        assert "product/" in page.locator(".answer-card:visible .source-path").inner_text()
        assert "not a verified answer" in page.locator("#demo-first-result").inner_text()
        page.locator(".answer-card:visible").first.get_by_role("button", name="Inspect evidence").click()
        assert page.locator("#record-detail .source-path").is_visible()
        source_before = page.locator("#record-detail .record-body").inner_text()
        page.locator("#demo-he").click()
        assert page.locator("html").get_attribute("dir") == "rtl"
        assert page.locator("#record-detail .record-body").inner_text() == source_before
        page.locator("[data-view=ask]").click()
        page.locator("#question").fill("zzznomatchingrecordxyz")
        page.locator("#ask-submit").click()
        assert "לא נמצאו קטעים תומכים" in page.locator("#ask-results").inner_text()
        page.locator("#demo-back").click()
        page.locator("#lang-he").click()
        page.locator(".card").nth(1).click()
        assert "support/" in page.locator(".answer-card:visible .source-path").inner_text()
        assert "נהלים בדיוניים בלבד" in page.locator("#demo-corpus-label").inner_text()
        page.locator("#demo-more-sources").click()
        assert page.locator(".answer-card:visible").count() > 1
        page.locator("[data-view=explore]").click()
        assert page.locator("#spatial-canvas").is_visible()
        page.locator("#mode-toggle").click()
        assert page.locator("#flat-canvas").is_visible()
        for width in (360, 768, 1440):
            page.set_viewport_size({"width": width, "height": 900})
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
        assert not errors, errors
        assert not network, network
        browser.close()
    print("PASS: bilingual journey, sources, gap, map fallback, responsive widths, and no runtime network")


if __name__ == "__main__":
    main()
