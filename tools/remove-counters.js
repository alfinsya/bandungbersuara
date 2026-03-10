const fs = require('fs');
const path = require('path');

// Files to clean
const filesToClean = [
  path.resolve(__dirname, '../index.html'),
  path.resolve(__dirname, '../article'),
];

function removeViewsAndCommentCounts(htmlContent) {
  // Remove view count span with <span> tags: <span class="ml-3"><i class="far fa-eye mr-2"></i>8.234</span>
  htmlContent = htmlContent.replace(
    /<span class="ml-3"><i class="far fa-eye mr-2"><\/i>[^<]*<\/span>/g,
    ''
  );
  
  // Remove comment count span with <span> tags: <span class="ml-3"><i class="far fa-comment mr-2"></i>45</span>
  htmlContent = htmlContent.replace(
    /<span class="ml-3"><i class="far fa-comment mr-2"><\/i>[^<]*<\/span>/g,
    ''
  );

  // Remove view count with <small> tags: <small class="ml-3"><i class="far fa-eye mr-2"></i>12345</small>
  htmlContent = htmlContent.replace(
    /<small class="ml-3"><i class="far fa-eye mr-2"><\/i>[^<]*<\/small>/g,
    ''
  );
  
  // Remove comment count with <small> tags: <small class="ml-3"><i class="far fa-comment mr-2"></i>123</small>
  htmlContent = htmlContent.replace(
    /<small class="ml-3"><i class="far fa-comment mr-2"><\/i>[^<]*<\/small>/g,
    ''
  );

  return htmlContent;
}

(async function() {
  try {
    console.log('🧹 Removing views and comment count icons only...');
    
    let totalCleaned = 0;

    // Clean index.html
    const indexPath = path.resolve(__dirname, '../index.html');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const cleanedIndex = removeViewsAndCommentCounts(indexContent);
      if (indexContent !== cleanedIndex) {
        fs.writeFileSync(indexPath, cleanedIndex, 'utf8');
        console.log(`✅ Cleaned: index.html`);
        totalCleaned++;
      }
    }

    // Clean article files
    const articleDir = path.resolve(__dirname, '../article');
    if (fs.existsSync(articleDir)) {
      const articleFiles = fs.readdirSync(articleDir).filter(f => f.endsWith('.html'));
      for (const file of articleFiles) {
        const filePath = path.join(articleDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const cleanedContent = removeViewsAndCommentCounts(content);
        if (content !== cleanedContent) {
          fs.writeFileSync(filePath, cleanedContent, 'utf8');
          console.log(`✅ Cleaned: ${file}`);
          totalCleaned++;
        }
      }
    }

    console.log(`\n✅ Done! Cleaned ${totalCleaned} files.`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
