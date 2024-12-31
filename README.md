
# Inventory Management System

A simple inventory management system built with Remix.js, TypeScript, Postgres, Prisma ORM, and Shopify Polaris for UI. This application allows users to add, edit, delete, and manage products in an inventory.


## Features ✨

- Add new products to the inventory.
- Edit existing product details (name and quantity).
- Delete products with a confirmation dialog.
- Alerts for success or failure of actions (add, update, delete).
- Double-click functionality to edit product names inline.
## Setup Instructions
  To set up and run this project locally, follow these steps:
  ### Prerequisites
  Ensure you have the following installed:
  - Node.js and npm installed on your system.
  - PostgreSQL database set up and running.
  - Prisma CLI installed globally (npm install -g prisma).
  ### Installation
  1. Clone the repository:
  ```bash
  git clone https://github.com/your-username/vidhive.git
  cd inventory-management
  ```

  2. Install dependencies:
  ```bash
  npm install  
  ```
  3. Configure the Database
      - Create a .env file in the root of your project with the following content:
        ```bash
        DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
        ```
        Replace <user>, <password>, <host>, <port>, and <database> with your PostgreSQL    credentials.
      - Run Prisma commands to set up the database:
        ```bash
        npx prisma migrate dev --name init
        npx prisma generate
        ```
  ### Running the App
  Start the development server:
  ```bash
  npm run dev
  ```
  The app will be available at http://localhost:5173.


## Implementation Overview

#### Key Implementation Details

- #### Dynamic Add/Edit Page:
    - The application uses a single page for both adding and editing products (routes/products/$id.tsx).
    - If the id parameter is "new", a new product is created; otherwise, the product with the given ID is edited.
- #### Database:
    - PostgreSQL is used as the database, and Prisma ORM handles schema definition and database interactions.
    - Products are stored in a Product table with the following fields:
        - id: Primary key (integer).
        - title: Product name (string).
        - quantity: Quantity of the product (integer).
- #### User Interface:
    - The UI is built using Shopify Polaris for a consistent design.
    - Key Polaris components include Page, Card, Button, and TextField.
- #### Double-Click to Edit:
    - Users can double-click the product title to enable an inline editing mode.
