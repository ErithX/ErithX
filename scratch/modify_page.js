const fs = require('fs');
const path = require('path');

const filePath = 'e:/projects/contest-tracker/app/dashboard/write/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports and component def
content = content.replace(
  `export default function WritePage() {`,
  `function WriteEditor() {\n  const searchParams = useSearchParams();\n  const editId = searchParams.get('id');`
);

content = content.replace(
  `import { useRouter } from 'next/navigation';`,
  `import { useRouter, useSearchParams } from 'next/navigation';`
);

content = content.replace(
  `import React, { useState, useEffect } from 'react';`,
  `import React, { useState, useEffect, Suspense } from 'react';`
);

// 2. useEffect fetch logic
content = content.replace(
  `        fetch('/api/documents')`,
  `        const fetchUrl = editId ? \`/api/documents/\${editId}\` : '/api/documents';\n        fetch(fetchUrl)`
);

content = content.replace(
  `} else {
        setLoading(false);
      }
    });
  }, []);`,
  `} else {
        setLoading(false);
      }
    });
  }, [editId]);`
);

content = content.replace(
  `if (data._id) {`,
  `if (data.error) {\n              alert("Error loading document: " + data.error);\n              router.push('/dashboard/write');\n              return;\n            }\n            if (data._id) {`
);

content = content.replace(
  `if (data.content) setContent(data.content);`,
  `if (data.content) setContent(data.content);\n              if (data.category) setCategory(data.category);\n              if (data.tags) setTags(data.tags);\n              if (data.coverImage) setCoverUrl(data.coverImage);`
);

// 3. Export at bottom
content += `\nexport default function WritePage() {\n  return (\n    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>\n      <WriteEditor />\n    </Suspense>\n  );\n}\n`;

fs.writeFileSync(filePath, content);
console.log('Modified page.tsx');
