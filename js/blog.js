// blog.js

const BASE_URL = 'https://raw.githubusercontent.com/ksel172/ksel172.github.io/main/content/blogs/';
const BLOGS_PER_PAGE = 10;
let currentPage = 1;
let allBlogs = [];
let totalBlogs = 0;

async function fetchRootIndex() {
    try {
        const response = await fetch(`${BASE_URL}blogs-index.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching root index:', error.message);
        return null;
    }
}

async function fetchBlogData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching blog data from ${url}:`, error.message);
        return null;
    }
}

async function fetchAllBlogs() {
    const rootIndex = await fetchRootIndex();
    if (!rootIndex) return;

    for (const [year, months] of Object.entries(rootIndex)) {
        for (const [month, blogs] of Object.entries(months)) {
            for (const blog of blogs) {
                const blogData = await fetchBlogData(blog.url);
                if (blogData) {
                    allBlogs.push({
                        ...blog,
                        ...blogData
                    });
                }
            }
        }
    }

    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    totalBlogs = allBlogs.length;
    displayBlogs();
}

function displayBlogs() {
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = '';

    const start = (currentPage - 1) * BLOGS_PER_PAGE;
    const end = start + BLOGS_PER_PAGE;
    const blogsToDisplay = allBlogs.slice(start, end);

    blogsToDisplay.forEach(blog => {
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        
        // Use the htmlPath directly from the blog data
        const htmlPath = blog.htmlPath || '#'; // Fallback to '#' if htmlPath is undefined
        
        blogItem.innerHTML = `
            <h2>${blog.title}</h2>
            <p class="date">${new Date(blog.date).toLocaleDateString()}</p>
            <p class="excerpt">${blog.excerpt || ''}</p>
            <a href="${htmlPath}" class="read-more">Read More</a>
        `;
        blogList.appendChild(blogItem);
    });

    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayBlogs();
        };
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pagination.appendChild(pageButton);
    }
}

// Initialize
fetchAllBlogs();