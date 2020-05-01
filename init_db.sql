CREATE TABLE IF NOT EXISTS users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(25) NOT NULL UNIQUE,
	pass VARCHAR(255) NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tabs (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(255) DEFAULT '(untitled)' NOT NULL,
	user INT NOT NULL, /*user id of tab owner*/
	forked_from INT NOT NULL, /*tab id of where it was forked from*/
	is_public BOOLEAN NOT NULL,
	last_edit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	/*there is a JSON type in MySQL, but we should never have to interact with it other than updating the entire .json file*/
	tab_data MEDIUMTEXT NOT NULL,
	/*commented out because why not let users have multiple tabs with the same name? Maybe ask them if they're sure they want to save under the same name as an existing tab first*/
	/*CONSTRAINT no_same_titles UNIQUE (title,user),*/
	FOREIGN KEY (user) REFERENCES users(id),
	FOREIGN KEY (forked_from) REFERENCES tabs(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tags (
	tab INT NOT NULL,
	tag VARCHAR(15), /*shouldn't have tags longer than 15 chars*/
	CONSTRAINT double_tag UNIQUE (tab,tag),
	FOREIGN KEY (tab) REFERENCES tabs(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS likes (
	tab INT NOT NULL,
	user INT NOT NULL,
	FOREIGN KEY (tab) REFERENCES tabs(id),
	FOREIGN KEY (user) REFERENCES users(id)
) ENGINE=INNODB;

/*one tab being shared with a user*/
CREATE TABLE IF NOT EXISTS shares (
	tab INT NOT NULL,
	user INT NOT NULL,
	can_edit BOOLEAN NOT NULL,
	CONSTRAINT no_multiple_share UNIQUE (tab, user),
	FOREIGN KEY (tab) REFERENCES tabs(id),
	FOREIGN KEY (user) REFERENCES users(id)
) ENGINE=INNODB;

/*TODO: run my password through the same encryption as the final product will use, and insert that straight into here*/
INSERT INTO users VALUES (1,'rob','temporarypassword');

INSERT INTO tabs VALUES (1,'(blank)',1,1,TRUE,CURRENT_TIMESTAMP,'TODO: insert the most basic tab json here bruh');
/*Note: this tab says it's forked from itself because "forked from" can't be null. Might have to allow null just for this, I still want everyone to fork from one original tab*/

INSERT INTO tags VALUES (1,'welcometotabby');
INSERT INTO tags VALUES (1,'firsttab');
INSERT INTO likes VALUES(1,1); /*I like my own tab*/
