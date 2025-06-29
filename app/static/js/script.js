let lastDiff = null;
const form = document.getElementById('jsonForm');
const downloadBtn = document.getElementById('downloadBtn');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch('/compare', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    console.log("Compare result:", result);  // 🔍 Debug log

    const diffOutput = document.getElementById('diffOutput');

    if (result.error) {
      diffOutput.innerHTML = '<p style="color:red;">' + result.error + '</p>';
      downloadBtn.style.display = 'none';
    } else if (result.same) {
      diffOutput.innerHTML = '<p style="color:green;">JSON files are identical ✅</p>';
      downloadBtn.style.display = 'none';
    } else {
      const delta = result.diff;
      lastDiff = delta;
      const left = result.left;

      const html = jsondiffpatch.formatters.html.format(delta, left);
      diffOutput.innerHTML = '';
      diffOutput.appendChild(html);
      jsondiffpatch.formatters.html.hideUnchanged();
      downloadBtn.style.display = 'inline-block';
    }

  } catch (err) {
    console.error("Error comparing:", err);
  }
});
