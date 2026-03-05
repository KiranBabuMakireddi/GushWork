# Gushwork Website

This is a static website built for **Gushwork | Mangalam HDPE Pipes**.
The project is created using **HTML, CSS, and JavaScript** and displays product information, applications, processes, FAQs, and testimonials using JSON data.

---

## Project Structure

```
GUSHWORK/

├ images/
│   ├ application.png
│   ├ euroflex_main_logo.png
│   ├ headerlogo.png
│   └ product_pipes.png

├ json/
│   ├ applications.json
│   ├ faq.json
│   ├ process.json
│   ├ products.json
│   └ testimonials.json

├ index.html
├ style.css
├ script.js
├ modal.js
├ toast.js
└ README.md
```

---

## How to Run the Project

### Option 1: Run Locally (Recommended)

1. Clone the repository

```
git clone <https://github.com/KiranBabuMakireddi/GushWork>
```

2. Open the project folder.

3. In VS Code install **Live Server** extension.

4. Right click `index.html` → **Open with Live Server**

---

### Option 2: Open Directly

You can open:

```
index.html
```

But some browsers block JSON loading without a local server.

---

## JSON Data Usage

Example:

```
fetch('/json/applications.json')
```

---

## Deployment

This project can be deployed on **Vercel**, **Netlify**, or **GitHub Pages**.

Steps:

1. Push code to GitHub
2. Import repository in Vercel
3. Click Deploy

---

## Technologies Used

* HTML
* CSS
* JavaScript
* Font Awesome
* JSON

---

## Author

Developed for **Makireddi Kiran Babu**
