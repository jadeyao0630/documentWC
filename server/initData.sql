DECLARE @projects TABLE (
	id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(1000),
    isDisabled BIT default 0
);

INSERT INTO @projects (name, isDisabled) VALUES
(N'国瑞熙墅',0),
(N'苏州国瑞',0),
(N'北七家项目',0);

MERGE INTO projects AS target
USING @projects AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET 
        target.name = source.name,
        target.isDisabled = source.isDisabled
WHEN NOT MATCHED THEN
    INSERT (name)
    VALUES (source.name);



DECLARE @categories TABLE (
	id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(1000),
    isDisabled BIT default 0
);

INSERT INTO @categories (name, isDisabled) VALUES
(N'运营类',0),
(N'投资结算',0),
(N'营销类',0),
(N'物业中标通知书',0),
(N'审计文件',0),
(N'上市公司文件',0),
(N'股票债券文件',0),
(N'图纸类',0),
(N'招商文件',0);

MERGE INTO categories AS target
USING @categories AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET 
        target.name = source.name,
        target.isDisabled = source.isDisabled
WHEN NOT MATCHED THEN
    INSERT (name)
    VALUES (source.name);



DECLARE @locations TABLE (
	id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(1000),
    isDisabled BIT default 0
);

INSERT INTO @locations (name, isDisabled) VALUES
(N'销售类合同模板',0),
(N'苏州营销',0),
(N'北七家商品房精装修',0),
(N'北七家营销',0),
(N'物业公司运营文件',0);

MERGE INTO locations AS target
USING @locations AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET 
        target.name = source.name,
        target.isDisabled = source.isDisabled
WHEN NOT MATCHED THEN
    INSERT (name)
    VALUES (source.name);

