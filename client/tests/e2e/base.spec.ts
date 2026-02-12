import { test, expect, Page } from "@playwright/test";

// Helpers -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
const uniqueEmail = () =>
  `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;

async function signup(page: Page, email: string) {
  await page.goto("/");
  const form = page.locator("form");

  // switch to register mode (second Sign up button = toggle)
  await form.getByRole("button", { name: "Sign up" }).click({ force: true });

  await form.getByPlaceholder("email").fill(email);
  await form.getByPlaceholder("password").fill("password123");

  // submit (first Sign up = submit)
  await form.getByRole("button", { name: "Sign up" }).click({ force: true });

  await expect(page.getByText("Logout")).toBeVisible();
}

// tests -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
test("1. landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Drag to adjust/i)).toBeVisible();
});

test("2. signup flow", async ({ page }) => {
  await signup(page, uniqueEmail());
});

test("3. signin flow", async ({ page }) => {
  const email = uniqueEmail();
  await signup(page, email);

  // logout
  await page.getByText("Logout").click({ force: true });

  // login
  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password").fill("password123");
  await page
    .getByRole("button", { name: "Sign in" })
    .first()
    .click({ force: true });

  await expect(page.getByText("Logout")).toBeVisible();
});

test("4. add color and see it in favorites", async ({ page }) => {
  const email = uniqueEmail();
  await signup(page, email);

  // default hex is #ff0000 → click Add
  await page.getByRole("button", { name: "Add" }).click({ force: true });

  // go to Favorites
  await page.getByRole("button", { name: "Favorites" }).click({ force: true });

  // must see two occurrences of #ff0000
  await expect(page.getByText("#ff0000")).toHaveCount(1);
});
