DEALORA — MULTI-MARKETPLACE STOREFRONT
========================================

FILES
-----
index.html      -> page structure
styles.css      -> all styling and responsive design
script.js       -> product database + search/filter/sort/wishlist/modal logic
images/         -> product images

RUN IN VS CODE
--------------
1. Open this "reselling-store" folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click index.html.
4. Choose "Open with Live Server".

ADDING A PRODUCT
----------------
Open script.js.

Find:
const products = [

Add another object like this:

{
  id: "p9",
  name: "Your Product Name",
  price: 799,
  oldPrice: 1499,
  category: "Electronics",
  marketplace: "Amazon",
  image: "images/my-product.jpg",
  link: "https://www.amazon.in/your-real-product-link",
  description: "A short product description."
},

SAVE THE IMAGE
--------------
Put your image inside:
images/

Then set:
image: "images/my-product.jpg"

DISCOUNT
--------
You do NOT need to enter a discount percentage.
The website automatically calculates it from price and oldPrice.

Example:
price = 799
oldPrice = 1499

The site calculates the percentage and displays the badge.

BUY NOW LINKS
-------------
Replace the example marketplace homepage URLs with the exact original
product URL supplied by the marketplace.

The Buy button opens the original product page in a new tab.

WISHLIST
--------
Wishlist items are saved in the visitor's browser using localStorage.
No database is required for this demo version.

IMPORTANT FOR A REAL STORE
--------------------------
This is a front-end storefront. It does not automatically fetch prices,
stock, reviews, images, or product links from marketplaces.

For production, use the relevant marketplace affiliate/API/feed system,
respect each marketplace's terms, and keep product/price data updated.

CHANGE THE BRAND
----------------
Search and replace "Dealora" in index.html with your friend's store name.
