# Full-Stack Case Study

This is a full-stack application built to fulfill the requirements of a technical assignment. It features a robust backend API developed with Node.js and a dynamic, responsive frontend client built with React.

**Live Demo with ... :** `[Link to your deployed application]`

## 1. Core Features

* **Dynamic Pricing:** Product prices are calculated on-the-fly by the API using the formula: `Price = (popularityScore + 1) * weight * currentGoldPrice`.
* **Interactive UI:** The frontend provides a seamless user experience with an interactive product carousel, stateful color selection that updates product images, and clear visual feedback for loading and error states.
* **API-Driven Content:** All product information, including dynamically calculated prices and popularity ratings, is served by the backend API.
* **Backend Filtering (Bonus):** The API supports filtering products by price range and popularity score.

## 2. Technical Architecture & Design

The project follows modern development principles, emphasizing a clear separation of concerns between the backend and frontend, and within each layer itself.

### 2.1. Backend (Node.js & Express.js)

The backend is architected with a layered approach to ensure modularity and scalability. The request lifecycle flows through distinct layers of responsibility: **Router -> Validator -> Controller -> Service**.

* **Layered Architecture:**
    * **Routing (`products.js`):** Defines the API endpoints and directs incoming requests to the appropriate handlers.
    * **Validation (`productValidator.js`):** Utilizes `express-validator` to sanitize and validate request parameters (e.g., ensuring `/:id` is an integer) before they reach the business logic, preventing invalid data processing.
    * **Controller (`productController.js`):** Acts as the bridge between the HTTP layer and the application's business logic. It parses the request and invokes the corresponding service function.
    * **Service (`productService.js`):** Contains the core business logic, including data retrieval, price calculation, and filtering.
* **Dynamic Pricing & Caching (`goldPriceService.js`):**
    * To fulfill the dynamic pricing requirement, a service was created to fetch real-time gold prices.
    * **API Key Security:** A public, keyless API was intentionally chosen to avoid committing sensitive API keys to a public repository. The service fetches data in TRY and performs the necessary currency conversion to USD on the fly.
    * **Performance Optimization:** To mitigate latency and reduce external API calls, the fetched gold price is **cached in-memory for 5 minutes**. Subsequent requests within this window are served instantly from the cache.
* **Robustness & Error Handling:**
    * **Centralized Error Handling (`errorHandler.js`):** All errors thrown within the application are propagated to a single, centralized middleware. This handler logs the error in detail using `winston` and sends a standardized, structured JSON error response to the client.
    * **Graceful Shutdown (`server.js`):** The server is configured to handle `uncaughtException` and `SIGTERM` signals, ensuring a clean shutdown without leaving open connections or corrupted state.

### 2.2. Frontend (React)

The frontend is built using a component-based architecture, promoting reusability and a clear data flow.

* **Component Architecture:**
    * **Container vs. Presentational Components:** The application separates components by concern. `ProductList.js` acts as a "container," managing state and data fetching logic. `ProductCard.js` is a "presentational" component, responsible only for rendering the UI based on the `props` it receives.
    * **State Management:** Local component state (`useState`) is used effectively within `ProductCard.js` to manage the currently selected color, providing instant UI feedback without re-fetching data.
* **User Experience (UX) & Asynchronicity:**
    * **Loading/Error States:** The `ProductList` component provides clear user feedback by displaying a `Loader` component while fetching data and an `ErrorMessage` component if the API call fails. This prevents a blank or unresponsive UI.
    * **Interactive Carousel:** The product list is implemented as a responsive carousel. It supports navigation via arrow buttons on desktop (managed with a `useRef`) and native swipe gestures on mobile devices for an intuitive experience.
    * **Visual Integrity:** An `onError` handler is attached to product images. If an image fails to load, a placeholder is displayed, preventing broken image icons and maintaining UI consistency.
* **Styling:**
    * **CSS Modules:** Each component is styled with its own `.module.css` file. This scopes class names locally, eliminating the risk of global style conflicts and improving maintainability.
    * **Global Design Tokens:** A global stylesheet (`App.css`) defines CSS variables (e.g., `--color-yellow-gold`) for the application's color palette, ensuring design consistency and making future theming changes trivial.

## 3. API Endpoints

| Method      | Endpoint      | Description                                                                    |
| :---------- | :------------ | :----------------------------------------------------------------------------- |
| `GET`       | `/products`   | Retrieves a list of all products. Supports optional query parameters for filtering. |
| `GET`       | `/products/:id` | Retrieves a single product by its ID.                                          |

**Query Parameters for `/products`:**

* `minPrice` (number): Filters for products with a price greater than or equal to this value.
* `maxPrice` (number): Filters for products with a price less than or equal to this value.
* `popularityScore` (number): Filters for products with a specific popularity score.

## 4. Local Development

1.  **Backend:**
    ```bash
    cd <backend_directory>
    npm install
    npm start
    ```
    The API will be running on `http://localhost:5000`.

2.  **Frontend:**
    ```bash
    cd <frontend_directory>
    npm install
    npm start
    ```
    The React application will be available at `http://localhost:3000`.
