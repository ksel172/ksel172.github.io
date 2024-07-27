let blogStructure = {};

// Fetch blog structure from JSON files
async function fetchBlogStructure() {
    const years = ['2024', '2023']; // Define years you want to fetch
    const months = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01']; // Months to check

    for (const year of years) {
        blogStructure[year] = {};
        for (const month of months) {
            try {
                const response = await fetch(`content/blogs/${year}/${month}/blogs.json`);
                if (response.ok) {
                    blogStructure[year][month] = await response.json();
                    console.log(`Loaded blogs for ${year}/${month}`);
                } else {
                    console.error(`Failed to fetch blogs for ${year}/${month}. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching blogs for ${year}/${month}:`, error);
            }
        }
    }
}

// Load blog list into the page
async function loadBlogList() {
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = ''; // Clear existing list

    for (const year in blogStructure) {
        for (const month in blogStructure[year]) {
            for (const blog of blogStructure[year][month]) {
                try {
                    const response = await fetch(`content/blogs/${year}/${month}/${blog}`);
                    if (response.ok) {
                        const blogData = await response.json();
                        const blogItem = document.createElement('div');
                        blogItem.className = 'blog-item';
                        blogItem.innerHTML = `
                            <h2>${blogData.title}</h2>
                            <p class="date">${blogData.date}</p>
                            <button class="read-more" data-year="${year}" data-month="${month}" data-blog="${blog}">Read More</button>
                        `;
                        blogList.appendChild(blogItem);
                    } else {
                        console.error(`Error loading blog: ${year}/${month}/${blog}. Status: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Error loading blog: ${year}/${month}/${blog}`, error);
                }
            }
        }
    }

    // Add event listeners to "Read More" buttons
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', loadFullBlog);
    });
}

// Load the full blog content when "Read More" button is clicked
async function loadFullBlog(event) {
    const year = event.target.dataset.year;
    const month = event.target.dataset.month;
    const blog = event.target.dataset.blog;

    try {
        const response = await fetch(`content/blogs/${year}/${month}/${blog}`);
        if (response.ok) {
            const blogData = await response.json();
            const blogContent = document.getElementById('blogContent');
            blogContent.innerHTML = `
                <h2>${blogData.title}</h2>
                <p class="date">${blogData.date}</p>
                <div class="content">${blogData.content}</div>
            `;
            blogContent.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error(`Error loading full blog: ${year}/${month}/${blog}. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading full blog: ${year}/${month}/${blog}`, error);
    }
}

// Initialize blog loader on page load
async function initBlogLoader() {
    await fetchBlogStructure();
    await loadBlogList();
}

// Call the initializer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initBlogLoader);
