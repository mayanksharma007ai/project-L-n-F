
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('checkbox');
  const sideNav = document.getElementById('sideNav');

  if (!checkbox || !sideNav) return; // check if they exist

  // makes the menu open and close
  function syncMenu() {
    if (checkbox.checked) {
      sideNav.classList.add('open'); // show menu
    } else {
      sideNav.classList.remove('open'); // hide menu
    }
  }

  syncMenu(); // run it once

  checkbox.addEventListener('change', syncMenu); // when checkbox changes

  // close menu when clicking links
  sideNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      checkbox.checked = false;
      syncMenu();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { // close with escape key
      checkbox.checked = false;
      syncMenu();
    }
  });
});

function toggleMenu() {
    var menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active'); // show/hide mobile menu
}

// switches between lost and found
function showSection(sectionName) {
    var lostSection = document.getElementById('lostSection');
    var foundSection = document.getElementById('foundSection');
    var lostBtn = document.getElementById('lostBtn');
    var foundBtn = document.getElementById('foundBtn');
    
    if (sectionName === 'lost') {
        lostSection.classList.add('active'); // show lost items
        foundSection.classList.remove('active'); // hide found items
        lostBtn.classList.add('active');
        foundBtn.classList.remove('active');
    } else {
        foundSection.classList.add('active'); // show found items
        lostSection.classList.remove('active'); // hide lost items
        foundBtn.classList.add('active');
        lostBtn.classList.remove('active');
    }
}


const form = document.getElementById('createPostForm');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // dont reload page
    
    try {
        const formData = new FormData();
        
        // get all the form stuff
        const itemName = document.getElementById('itemName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const description = document.getElementById('description').value;
        const category = document.querySelector('input[name="status"]:checked').value;
        const location = document.querySelector('input[name="location"]:checked').value;
        const imageFile = document.getElementById('uploadimage').files[0];
        
        // check if they filled everything
        if (!itemName || !phoneNumber || !description) {
            alert('Please fill in all required fields');
            return;
        }
        
        // put data in formData
        formData.append('itemName', itemName);
        formData.append('phoneNumber', phoneNumber);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('location', location);
        
        // add user email if logged in
        if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
            formData.append('userEmail', auth.getCurrentUser().Email);
        }
        
        if (imageFile) {
            formData.append('image', imageFile); // add image if they uploaded one
        }
        
        console.log('Sending data:', {
            itemName,
            phoneNumber,
            description,
            category,
            location,
            hasImage: !!imageFile
        });
        
        const response = await fetch('https://l-f-backend-i8np.onrender.com//api/create_post', {
            method: 'POST',
            // dont set content type - browser does it
            body: formData
        });
        
        const data = await response.json();
        console.log('Response:', data);
        
        if (response.ok) {
            alert('Post created successfully!');
            window.location.href = 'Home.html'; // go to home page
        } else {
            alert('Failed to create post: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Could not connect to the server.');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');

    // gets posts from server and shows them
    async function fetchAllPosts() {
        postsContainer.innerHTML = '<h2>Loading posts...</h2>';

        try {
            // get posts from backend
            const response = await fetch('https://l-f-backend-i8np.onrender.com//api/items');
            const posts = await response.json();

            postsContainer.innerHTML = ''; // clear loading text

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No items have been posted yet.</p>';
                return;
            }

            // make a card for each post
            posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';
                
                // use default image if no image
                const imageUrl = post.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';

                postCard.innerHTML = `
                    <img src="${imageUrl}" alt="${post.itemName}">
                    <h3>[${post.category.toUpperCase()}] ${post.itemName}</h3>
                    <p>${post.description}</p>
                `;
                postsContainer.appendChild(postCard);
            });

        } catch (error) {
            console.error('Failed to fetch posts:', error);
            postsContainer.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
        }
    }

    // load posts when page opens
    fetchAllPosts();
});