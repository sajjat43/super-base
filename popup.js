/*global chrome*/
document.addEventListener('DOMContentLoaded', function() {
  loadCookies();

  // Add event listener for "Delete All Cookies" button
  document.getElementById('deleteAllCookies').addEventListener('click', deleteAllCookies);
});

function loadCookies() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const url = new URL(currentTab.url);
    
    // Get cookies for the current domain
    chrome.cookies.getAll({domain: url.hostname}, function(cookies) {
      displayCookies(cookies);
    });
    
    // Get custom cookies if they exist
    const customCookies = {
      sessionId: getCookie('sessionId'),
      userId: getCookie('userId'),
      customData: getCookie('customData')
    };
    
    displayUserInfo();
  });
}

function displayCookies(cookies) {
  const cookieContainer = document.getElementById('cookieInfo');
  if (cookies.length > 0) {
    const cookieList = cookies.map(cookie => `
      <div class="cookie-item">
        <div class="cookie-content">
          <div class="cookie-name">${cookie.name}</div>
          <div class="cookie-value">${cookie.value.substring(0, 30)}${cookie.value.length > 30 ? '...' : ''}</div>
        </div>
        <button class="delete-btn" data-cookie-name="${cookie.name}" data-cookie-domain="${cookie.domain}">
          Delete
        </button>
      </div>
    `).join('');
    
    cookieContainer.innerHTML = cookieList;

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        deleteCookie(
          this.getAttribute('data-cookie-name'),
          this.getAttribute('data-cookie-domain')
        );
      });
    });
  } else {
    cookieContainer.innerHTML = `
      <div class="cookie-item">
        <div class="cookie-content">
          <div class="cookie-name">No cookies found</div>
        </div>
      </div>
    `;
  }
}

function deleteCookie(name, domain) {
  const url = `http${domain.startsWith('.') ? 's' : ''}://${domain.startsWith('.') ? domain.slice(1) : domain}`;
  
  chrome.cookies.remove({
    url: url,
    name: name
  }, function(details) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      loadCookies();
    }
  });
}

function deleteAllCookies() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const url = new URL(currentTab.url);
    
    chrome.cookies.getAll({domain: url.hostname}, function(cookies) {
      const deletePromises = cookies.map(cookie => {
        return new Promise(resolve => {
          const cookieUrl = `http${cookie.secure ? 's' : ''}://${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}`;
          chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name
          }, resolve);
        });
      });

      Promise.all(deletePromises).then(() => {
        loadCookies();
      });
    });
  });
}

function displayUserInfo() {
  const userContainer = document.getElementById('userInfo');
  chrome.storage.sync.get(['userProfile'], function(result) {
    if (result.userProfile) {
      userContainer.innerHTML = `
        <p><strong>User ID:</strong> ${result.userProfile.id || 'N/A'}</p>
        <p><strong>Email:</strong> ${result.userProfile.email || 'N/A'}</p>
        <p><strong>Name:</strong> ${result.userProfile.name || 'N/A'}</p>
      `;
    } else {
      userContainer.innerHTML = '<p>No user information available</p>';
    }
  });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
} 