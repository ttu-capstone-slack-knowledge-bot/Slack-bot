Project: Slack Bot

Sponsor: SAIC

Group: Lab group 6

Members:
- Ben Thompson
- Alison Rust
- Alexander Clifford
- Hannah Lafever
- Clay Webb

---------------------------------------

Current Slash Commands:
Make sure to add these in your personal bot to make sure you can use them

- /query - searches for a term in the database, optional input: [term]
- /add - adds a term to the database, optional input: [term]: [definition]
- /edit - edits a term's definition in the database, optional input: [term]: [definition]
- /delete - deletes a term in the database, optional input: [term]
- /terms - displays all the terms and definitions in the database, optional input: [letter]
- /addtag - adds a tag to a term, optional input: [term]: [tag]
- /viewtags - displays all the tags for a given term, optional input: [term]
- /searchbytag - searches for terms with a given tag, optional input: [tag]

---------------------------------------

Retired Bot Features:
These are previous implementations that are no longer in use, but are still in our code in case another team is assigned to continue the project

- Able to respond to direct @bot messages if specific words are in the message.
- Able to send a brief help message if the user sends "@bot_name help"
- Able to tell the user a definition of a term if the user sends a message in the form of "@bot_name what does ___ mean?"
- Able to add a term and definition to the database if the user sends a message in the form of "@bot_name add ___: ___"
- Able to tag a term if the user sends a message in the form of "@bot_name ___ with ___"
- Able to display the contents of the databse if the user sends a message in the form of "@bot_name give ___"