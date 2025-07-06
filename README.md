# Full-Stack Case Study

This is a full-stack application built to fulfill the requirements of a technical assignment. It features a robust backend API developed with Node.js and a dynamic, responsive frontend client built with React.

**Live Demo with ... :** `[Link to your deployed application]`

## 1. Core Features

* **Dynamic Pricing:** Product prices are calculated on-the-fly by the API using the formula: `Price = (popularityScore + 1) * weight * currentGoldPrice`.
* **Secure API Integration:** Real-time gold prices are fetched from an external financial data API. The API key is managed securely using environment variables and is never exposed in the codebase.
* **Performance Optimization:** Fetched data is cached in-memory for 5 minutes to reduce latency and minimize external API calls, ensuring a fast user experience.
* **Interactive UI:** The frontend provides a seamless user experience with an interactive product carousel, stateful color selection that updates product images, and clear visual feedback for loading and error states.
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
* **Dynamic Pricing & Secure API Integration (`goldPriceService.js`):**
    * To fulfill the dynamic pricing requirement, the service integrates with the goldapi.io real-time data provider to fetch gold prices in USD.
    * **API Key Security:** The API key is managed securely following industry best practices. It is loaded from a local .env file during development and from Heroku Config Vars in production. This ensures that sensitive credentials are never committed to the Git repository.
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
    * **Popularity Score Conversion:** To meet the design requirements, the raw `popularityScore` (a value between 0 and 1) is converted into a more intuitive 5-star rating. This is handled within the `StarRating` component, which calculates the rating by multiplying the score by 5 and displays it both visually with star icons (FaStar, FaStarHalfAlt, FaRegStar) and textually as a score out of 5 with one decimal place (e.g., "4.5/5").
    * **Visual Integrity:** An `onError` handler is attached to product images. If an image fails to load, a placeholder is displayed, preventing broken image icons and maintaining UI consistency.
* **Styling:**
    * **CSS Modules:** Each component is styled with its own `.module.css` file. This scopes class names locally, eliminating the risk of global style conflicts and improving maintainability.
    * **Typography:** The initial design specification required the use of Avenir Book. As Avenir Book is a licensed commercial font, an open-source alternative was selected. The Nunito font was chosen for its close structural and visual resemblance. It is imported via Google Fonts and set as the primary font for the application, successfully capturing the clean, modern feel of the original design request.
    * **Global Design Tokens:** A global stylesheet (`App.css`) defines CSS variables (e.g., `--color-yellow-gold`) for the application's color palette, ensuring design consistency and making future theming changes trivial.

## 3. API Endpoints

| Method      | Endpoint      | Description                                                                    |
| :---------- | :------------ | :----------------------------------------------------------------------------- |
| `GET`       | `/products`   | Retrieves a list of all products. Supports optional query parameters for filtering. |
| `GET`       | `/products/:id` | Retrieves a single product by its ID.                                          |


### Query Parameters for `GET /products`

The `/products` endpoint supports the following query parameters to filter the results. These parameters can be used in combination.

* **Price Range Filtering:**
    * `minPrice` (number): Returns products with a dynamic price **greater than or equal to** the specified value.
    * `maxPrice` (number): Returns products with a dynamic price **less than or equal to** the specified value.
    * **Example:** `/products?minPrice=500&maxPrice=1000` will list all products priced between $500 and $1000, inclusive.

* **Popularity Score Filtering:**
    * `popularityScore` (number): Returns products that **exactly match** the specified popularity score.
    * **Example:** `/products?popularityScore=0.95` will list all products with a popularity score of exactly 0.95.

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
