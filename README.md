# Full-Stack Case Study

This is a full-stack application built to fulfill the requirements of a technical assignment. It features a robust backend API developed with Node.js and a dynamic, responsive frontend client built with React.

**Live Demo:** [https://renart-case-study-d8600db4fc02.herokuapp.com/](https://renart-case-study-d8600db4fc02.herokuapp.com/)

## 1. Core Features

* **Dynamic Product Pricing:** Product prices are not static. They are calculated in real-time based on the product's weight, its popularity score, and the current market price of gold.
* **Interactive Product Carousel:** The frontend presents products in a smooth, horizontally scrollable list with easy-to-use navigation arrows, built from the ground up using React hooks and refs.
* **Dynamic UI Updates:** Users can select different metal colors for each product (Yellow, White, or Rose Gold), and the product card instantly updates the image and color name without a page reload.
* **External API Integration & Caching:** The application fetches real-time gold prices from the GoldAPI.io service. To ensure high performance and reliability, fetched prices are cached in memory for two hours, reducing dependency on the external service for frequent requests.
* **Background Data Refresh:** A background service automatically updates the cached gold price every two hours, ensuring the pricing data remains current without blocking user requests.
* **Advanced Filtering:** The API allows users to filter the product list by a dynamic price range (`minPrice`, `maxPrice`) and by a specific `popularityScore`.
* **Responsive Design:** The application layout is fully responsive, providing an optimal viewing experience on both desktop and mobile devices.
* **Robust Feedback States:** The client provides clear visual feedback to the user with a loading spinner during data fetching and a descriptive error message if the API call fails.

## 2. Technical Architecture & Design

The project follows modern development principles, emphasizing a clear separation of concerns between the backend and frontend, and within each layer itself.

### 2.1. Backend (Node.js & Express.js)

The backend is built on Node.js using the Express.js framework, following a layered architecture that separates concerns into distinct modules for routing, control, and services.

* **Entrypoint (`server.js`):** Initializes the Express application and, crucially, kicks off the `goldPriceService` to begin fetching and caching gold prices immediately on startup. It also includes a graceful shutdown handler.
* **Application Setup (`app.js`):** Configures the core Express application. It sets up essential middleware, including `cors` for cross-origin requests, `express.json` for parsing request bodies, and a custom logger for recording request details. It also defines the primary route for the products API.
* **Routing (`products.js`):** Defines the specific API endpoints available under the `/products` path. It maps the `GET /` and `GET /:id` endpoints to their corresponding controller functions and attaches validation middleware where necessary.
* **Controllers (`productController.js`):** Act as the intermediary between the API routes and the business logic. They are responsible for parsing HTTP requests, extracting parameters and query strings, invoking the appropriate service methods, and formatting the final HTTP response (either with data or an error).
* **Services (`productService.js`, `goldPriceService.js`):**
    * `goldPriceService.js`: A dedicated service that entirely encapsulates the logic for interacting with the external GoldAPI.io. It handles fetching, conversion from ounce to gram, caching, and the scheduled background updates. This isolates the external dependency.
    * `productService.js`: Contains the core business logic. It reads product data from a JSON file, uses the `goldPriceService` to get the current gold price, calculates the `dynamicPrice` for products, and applies any specified filters. It is designed to be completely independent of the HTTP layer.
* **Validation (`productValidator.js`):** Implements reusable validation rules using `express-validator`. This keeps validation logic separate from controller logic, making both cleaner and easier to maintain. The `handleValidationErrors` middleware provides a single point for checking and responding to validation failures.
* **Error Handling (`errorHandler.js`):** A centralized middleware that catches all errors passed to it via `next(error)`. It logs the error details for debugging and sends a clean, standardized JSON error message to the client, ensuring a consistent error response format across the entire API.
* **Logging (`logger.js`):** Configures a `winston` logger for structured and leveled logging, providing more informative and readable logs than `console.log`.

### 2.2. Frontend (React)

The frontend is a modern, single-page application (SPA) built with React. It is designed to be efficient, maintainable, and user-friendly.

* **Framework:** Built entirely with React, using functional components and hooks.
* **Component-Based Architecture:** The UI is broken down into logical, reusable components:
    * `App`: The root component that sets up the main application layout.
    * `ProductList`: A container component responsible for fetching product data, managing the overall state (loading, errors, color selections), and rendering the scrollable product carousel.
    * `ProductCard`: A presentational component that displays a single product's details. It is optimized with `React.memo` to prevent unnecessary re-renders.
    * `StarRating`: A small, reusable component for visually representing the product's popularity score.
* **State Management:** State is managed locally within components using React Hooks.
    * `useState` is used for managing product data, loading states, errors, and UI state like the selected color for each product.
    * `useEffect` handles the side effect of fetching data from the backend API when the `ProductList` component mounts.
    * `useRef` is used to get a direct reference to the scrollable list element to programmatically control its position.
    * `useCallback` optimizes the color change handler, ensuring the function is not recreated on every render.
* **Styling:** A hybrid styling approach is used for maintainability and scalability.
    * **CSS Modules:** Component-specific styles are managed with CSS Modules (`.module.css`). This locally scopes class names, preventing style conflicts between components.
    * **Global Styles & Custom Properties:** Global styles, custom font definitions (`@font-face`), and CSS Custom Properties (variables) for theme colors are defined in `App.css`. This allows for consistent branding and easy theme updates.
* **User Experience (UX):** The interface is designed for clarity and ease of use. It provides immediate feedback with a loading animation while fetching data and a clear error message if the backend is unavailable. The interactive elements like the color picker and scroll buttons are intuitive and responsive.

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | Retrieves a list of all products, each with a dynamically calculated price. Supports optional query parameters for filtering. |
| `GET` | `/products/:id` | Retrieves a single product by its ID, with a dynamically calculated price. |

### Query Parameters for `GET /products`

The `/products` endpoint supports the following query parameters to filter the results. These parameters can be used in combination.

* **Price Range Filtering:**
    * `minPrice` (number): Returns products with a dynamic price **greater than or equal to** the specified value.
    * `maxPrice` (number): Returns products with a dynamic price **less than or equal to** the specified value.
    * **Example:** `/products?minPrice=500&maxPrice=1000` will list all products priced between $500 and $1000, inclusive.

* **Popularity Score Filtering:**
    * `popularityScore` (number): Returns products that **exactly match** the specified popularity score.
    * **Example:** `/products?popularityScore=0.95` will list all products with a popularity score of exactly 0.95.
