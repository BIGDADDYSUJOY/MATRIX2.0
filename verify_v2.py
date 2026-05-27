
import os
import time
from playwright.sync_api import sync_playwright

def verify_animation():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Wait for dev server to be ready
        max_retries = 15
        for i in range(max_retries):
            try:
                page.goto('http://localhost:3000')
                break
            except Exception:
                if i == max_retries - 1:
                    raise
                time.sleep(1)

        # Wait for canvas to be visible
        page.wait_for_selector('canvas')

        # Take initial screenshot
        page.screenshot(path='initial_state_v2.png')
        print("Initial state captured.")

        # Press SPACE to toggle mode
        page.keyboard.press(' ')
        time.sleep(1)
        page.evaluate("window.scrollTo(0, 0)")
        page.screenshot(path='after_space_v2.png')
        print("After SPACE (mode toggle) captured.")

        # Increase frequency
        for _ in range(20):
            page.keyboard.press('F')
        time.sleep(1)
        page.evaluate("window.scrollTo(0, 0)")
        page.screenshot(path='after_freq_v2.png')
        print("After Freq increase captured.")

        browser.close()

if __name__ == "__main__":
    verify_animation()
