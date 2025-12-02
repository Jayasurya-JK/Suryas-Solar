const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'content', 'blog');

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        console.log('Found file:', file);
        if (file.includes('types-of-solar-panels') && file.length > 50) {
            const oldPath = path.join(directory, file);
            const newPath = path.join(directory, '2025-12-01-types-of-solar-panels-in-india.md');
            console.log(`Renaming "${file}" to "${newPath}"`);
            fs.rename(oldPath, newPath, (err) => {
                if (err) console.error('Error renaming:', err);
                else console.log('Successfully renamed!');
            });
        }
    });
});
