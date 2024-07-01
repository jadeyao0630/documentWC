import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Load the Excel file
const filePath = 'path_to_your_excel_file.xlsx';
const workbook = XLSX.readFile(filePath);

// Get the names of all sheets
const sheetNames = workbook.SheetNames;

// Define a function to process each sheet and save as an individual SQL file
const processAndSaveSheet = (sheetName, sheet) => {
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  const mssqlStatements= [];

  jsonData.forEach((row) => {
    const createTime = row['日期'] || '';
    const title = row['文件名称'] || row['请示名称'] || row['工程名称'] || row['图纸名称'] || row['合同名称'] || '';
    const category = sheetName;
    const project = row['所属项目'] || '';
    const agent = row['出图单位'] || row['发文单位'] || row['责任人'] || row['签发单位'] || '';
    const person = row['经办人'] || row['存档人'] || row['规划院移交人'] || '';
    const location = row['存放位置'] || row['盒号'] || '';
    const remark = row['中标金额'] || row['抵扣工程合同清单'] || row['版本号'] || row['抵押物'] || row['原件或复印件'] || '';

    // Create MSSQL insert statement
    const mssqlStatement = `INSERT INTO table_name (createTime, title, category, project, agent, person, location, remark) VALUES (N'${createTime}', N'${title}', N'${category}', N'${project}', N'${agent}', N'${person}', N'${location}', N'${remark}');`;
    mssqlStatements.push(mssqlStatement);
  });

  // Save to an individual SQL file
  const outputFilePath = `mssql_import_statements_${sheetName}.sql`;
  fs.writeFileSync(outputFilePath, mssqlStatements.join('\n'), 'utf-8');
  return outputFilePath;
};

// Process each sheet and save as individual SQL files
const outputFiles = [];
sheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const outputFile = processAndSaveSheet(sheetName, sheet);
  outputFiles.push(outputFile);
});

console.log('SQL files generated:', outputFiles);