IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'documents')
BEGIN
    CREATE DATABASE documents
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='documents_list' AND xtype='U')
BEGIN
    CREATE TABLE documents_list (
        id INT IDENTITY(1,1),
        docId INT,
        title NVARCHAR(1000),
        category NVARCHAR(255),
        categoryId INT default -1,
        project NVARCHAR(255),
        projectId INT default -1,
        person NVARCHAR(1000),
        location NVARCHAR(255),
        locationId INT default -1,
        createTime DATETIME,
        modifiedTime DATETIME,
        description NVARCHAR(1000),
        coverPage NVARCHAR(1000),
        attachement NVARCHAR(1000),
        PRIMARY KEY (id, docId)
    )
END