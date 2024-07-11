IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'documents')
BEGIN
    CREATE DATABASE documents
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='documents_list' AND xtype='U')
BEGIN
    CREATE TABLE documents_list (
        id INT IDENTITY(1,1),
        docId INT,
        title NVARCHAR(1000) default '',
        category NVARCHAR(255) default '',
        categoryId INT default -1,
        project NVARCHAR(255) default '',
        projectId INT default -1,
        agent NVARCHAR(1000) default '',
        person NVARCHAR(1000) default '',
        location NVARCHAR(255) default '',
        locationId INT default -1,
        createTime DATETIME,
        modifiedTime DATETIME,
        description NVARCHAR(1000) default '',
        remark NVARCHAR(1000) default '',
        coverPage NVARCHAR(1000) default '',
        attachement NVARCHAR(1000) default '',
        isDisabled BIT default 0,
        PRIMARY KEY (id, docId)
    )
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tags' AND xtype='U')
BEGIN
    CREATE TABLE tags (
        id INT PRIMARY KEY,
        name NVARCHAR(1000),
        freq INT DEFAULT 1,
        isDisabled BIT default 0,
    )
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='projects' AND xtype='U')
BEGIN
    CREATE TABLE projects (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(1000),
        isDisabled BIT default 0,
    )
END
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categories' AND xtype='U')
BEGIN
    CREATE TABLE categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(1000),
        isDisabled BIT default 0,
    )
END
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='locations' AND xtype='U')
BEGIN
    CREATE TABLE locations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(1000),
        isDisabled BIT default 0,
    )
END

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_list' AND xtype='U')
BEGIN
    CREATE TABLE user_list (
        id INT IDENTITY(1,1),
        name NVARCHAR(1000),
        userName NVARCHAR(255),
        pass NVARCHAR(1000),
        auth NVARCHAR(1000),
        userData NVARCHAR(1000),
        isDisabled BIT default 0,
        PRIMARY KEY (id, userName)
    )
END