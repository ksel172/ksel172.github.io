const BASE_URL = 'https://raw.githubusercontent.com/ksel172/ksel172.github.io/main/content/blogs/';
const BLOGS_PER_PAGE = 10;
let currentPage = 1;
let allBlogs = [];
let totalBlogs = 0;

async function fetchIndex(year, month) {
    try {
        const response = await fetch(`${BASE_URL}${year}/${month}/blogs-index.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching index for ${year}/${month}:`, error);
        return null;
    }
}

async function fetchBlogData(year, month, index) {
    try {
        const response = await fetch(`${BASE_URL}${year}/${month}/${index}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching blog data for ${year}/${month}/${index}:`, error);
        return null;
    }
}

async function fetchAllBlogs() {
    const years = [2023, 2024]; // Extend as needed
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    for (const year of years) {
        for (const month of months) {
            const index = await fetchIndex(year, month);
            if (index && Array.isArray(index)) {
                for (const blogIndex of index) {
                    const blogData = await fetchBlogData(year, month, blogIndex);
                    if (blogData) {
                        allBlogs.push(blogData);
                    }
                }
            }
        }
    }

    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
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
        blogItem.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${new Date(blog.date).toLocaleDateString()}</p>
            <p>${blog.content.substring(0, 100)}...</p>
            <button onclick="showFullContent('${blog.title}')">Read More</button>
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

function showFullContent(title) {
    const blog = allBlogs.find(b => b.title === title);
    if (blog) {
        const blogContent = document.getElementById('blogContent');
        blogContent.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${new Date(blog.date).toLocaleDateString()}</p>
            <div>${blog.content}</div>
            <button onclick="hideFullContent()">Close</button>
        `;
    }
}

function hideFullContent() {
    document.getElementById('blogContent').innerHTML = '';
}

// Initialize
fetchAllBlogs();
