// Load previous selections from storage when page opens
document.addEventListener('DOMContentLoaded', async () => {
  const stored = await chrome.storage.local.get('selectedElements');
  if (stored.selectedElements) {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (stored.selectedElements.includes(cb.value)) {
        cb.checked = true;
      }
    });
  }

  // Select All buttons
  document.querySelectorAll('.select-all-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const category = e.target.closest('.category');
      const checkboxes = category.querySelectorAll('input[type="checkbox"]');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);

      checkboxes.forEach(cb => {
        cb.checked = !allChecked; // if all checked, uncheck all; if not, check all
      });
    });
  });
  // Mini Apply buttons
  document.querySelectorAll('.mini-apply').forEach(button => {
    button.addEventListener('click', async (e) => {
      const category = e.target.closest('.category');
      const selectedElements = Array.from(category.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
 
      await chrome.storage.local.set({ selectedElements });  

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (tags) => {
          document.querySelectorAll('.element-badge').forEach(badge => {
            if (badge.parentElement && badge.parentElement.style) {
              badge.parentElement.style.outline = '';
            }
            badge.remove();
          });

          tags.forEach(tag => {
            document.querySelectorAll(tag).forEach(el => {
              el.style.outline = '2px dashed blue';
              el.style.position = 'relative';

              const badge = document.createElement('div');
              badge.textContent = tag.toUpperCase();
              badge.style.position = 'absolute';
              badge.style.top = '0';
              badge.style.left = '0';
              badge.style.backgroundColor = 'blue';
              badge.style.color = 'white';
              badge.style.fontSize = '10px';
              badge.style.padding = '2px 4px';
              badge.style.zIndex = '9999';
              badge.className = 'element-badge';
              el.appendChild(badge);
            });
          });
        },
        args: [selectedElements],
      });
    });
  });

});

// Main Highlight All button
document.getElementById('highlight').addEventListener('click', async () => {
  const selectedElements = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (selectedElements.length === 0) {
    alert('Please select at least one element.');
    return;
  }

  await chrome.storage.local.set({ selectedElements });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (tags) => {
      document.querySelectorAll('.element-badge').forEach(badge => {
        if (badge.parentElement && badge.parentElement.style) {
          badge.parentElement.style.outline = '';
        }
        badge.remove();
      });

      tags.forEach(tag => {
        document.querySelectorAll(tag).forEach(el => {
          el.style.outline = '2px dashed blue';
          el.style.position = 'relative';

          const badge = document.createElement('div');
          badge.textContent = tag.toUpperCase();
          badge.style.position = 'absolute';
          badge.style.top = '0';
          badge.style.left = '0';
          badge.style.backgroundColor = 'blue';
          badge.style.color = 'white';
          badge.style.fontSize = '10px';
          badge.style.padding = '2px 4px';
          badge.style.zIndex = '9999';
          badge.className = 'element-badge';
          el.appendChild(badge);
        });
      });
    },
    args: [selectedElements],
  });
});