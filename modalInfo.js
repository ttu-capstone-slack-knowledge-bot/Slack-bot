module.exports = {
  firstModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "FIRST MODAL",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "HEY! I'M A FRICKEN MODAL!",
          "emoji": true
        }
      }
    ]
  },
  secondModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Second Modal",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Hello. I am another modal. I am much calmer.",
          "emoji": true
        }
      }
    ]
  },
  inputModal: {
    "title": {
      "type": "plain_text",
      "text": "This one has INPUT",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit"
    },
    "type": "modal",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Hi, I have an input block. Won't you please put something inside of it?",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "inputText",
        "element": {
          "type": "plain_text_input",
          "action_id": "third_modal_submit"
        },
        "label": {
          "type": "plain_text",
          "text": "Input here",
          "emoji": true
        }
      }
    ],
    "callback_id": "basic-input"
  },
  getNameModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Hi, I'm Cappy!",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "nameInput",
        "hint": {
          "type": "plain_text",
          "text": "You don't have to tell me your real name. A nickname is cool too."
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "nameEntered"
        },
        "label": {
          "type": "plain_text",
          "text": "What's your name?",
          "emoji": true
        }
      }
    ],
    "callback_id": "getName"
  },
  homeTab: {
    "type": "home",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Hi, I'm Cappy!",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "\tI have been added to your workspace, and it's my job to help you! I can fetch definitions for simple terms and acronyms if I know them, or you can tell me what certain acronyms mean to help expand my knowledge base!\n\tBe sure to check back here often, as my feature set is constantly expanding!",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Quick Actions!",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "block_id": "Main_Buttons",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Add Term",
              "emoji": true
            },
            "value": "Add_Button",
            "action_id": "add"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Query Term",
              "emoji": true
            },
            "value": "Query_Button",
            "action_id": "query"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Edit Term",
              "emoji": true
            },
            "value": "Edit_Button",
            "action_id": "edit"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Delete Term",
              "emoji": true
            },
            "value": "Delete_Button",
            "action_id": "delete",
            "style": "danger"
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Cappy Bot Help Center",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Need a reminder of how to call me and get my help? Then look no further! Here's a list of the things you can ask me that I can help with!",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "• */query* - Look up any term within my knowledge base, and if I know it I will tell you what it means!\n• */add* - Add a term to my knowledge base so that I can remember it forever!\n• */edit* - Edit the definition of a term within my knowledge base to fix any typos or incorrect information.\n• */delete* - Deletes terms from my knowledge base. This is a permanent delete, so make sure you use this only when you definitely mean to. You can always use /add to put the term back in the knowledge base if you do delete something by accident.\n"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Aditional Commands*\n• */terms* - See a dictionary of everything I know, sorted by the letter.\n• */addtag* - Add a tag to something within my knowledge base to help me sort what I know.\n• */searchbytag* - Tell me a specific tag, and I'll tell you everything I know that has been tagged with that. This helps group up large amount of information."
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Additional Actions",
          "emoji": true
        }
      },
      {
        "type": "actions",
        "block_id": "Extra_Buttons",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Add Tag to Term",
              "emoji": true
            },
            "value": "AddTag_Button",
            "action_id": "addTag"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Search by Tag",
              "emoji": true
            },
            "value": "SearchByTag_Button",
            "action_id": "tagSearch"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "See Dictionary",
              "emoji": true
            },
            "value": "Dictionary_Button",
            "action_id": "dictionary"
          }
        ]
      }
    ]
  },
  //Clay
  editModal: {
    "type": "modal",
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "title": {
      "type": "plain_text",
      "text": "Edit",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "block_id": "editTermHeader",
        "text": {
          "type": "plain_text",
          "text": ":pencil: Edit\n\nLet's edit a term.",
          "emoji": true
        }
      }, //end of editHeader
      {
        "type": "divider"
      },
      { //TERM  INPUT
        "type": "input",
        "block_id": "editTermInput1",
        "label": {
          "type": "plain_text",
          "text": "What term are we changing?",
          "emoji": true
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "editTermEntered1"
        },
        "optional": false
        //"repsonse_action": "errors",
        //  "errors":{
        //    "editTermInput1": "Boo"
         // }
      }, //end of editTermInput1
      { //DESC INPUT
        "type": "input",
        "block_id": "editTermInput2",
        "label": {
          "type": "plain_text",
          "text": "What is the new definition?",
          "emoji": true
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "editTermEntered2"
        },
        "optional": false
      } // end of editTermInput2
    ],
    "callback_id": "edit-term"
  }, //end of editModal

  //Clay
  viewTagModal:  {
    "type": "modal",
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "title": {
      "type": "plain_text",
      "text": "View Tags",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "termInput",
        "label": {
          "type": "plain_text",
          "text": "Which term's tags do you want to view?",
          "emoji": false
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "termEntered"
        },
        "optional": false
      }
    ],
    "callback_id": "view-term-tags"
  },

  //Hannah
  addTerm: {
    "title": {
      "type": "plain_text",
      "text": "Add Term"
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "nameInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "nameEntered",
          "placeholder": {
            "type": "plain_text",
            "text": " "
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Enter a term/acronym"
        }
      },
      {
        "type": "input",
        "block_id": "descInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "descEntered",
          "multiline": true,
          "placeholder": {
            "type": "plain_text",
            "text": " "
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Enter a definition"
        }
      }
    ],
    "type": "modal",
    "callback_id": "addTerm"
  },
  //Hannah
  queryToAddModal: {
    "title": {
      "type": "plain_text",
      "text": "Add"
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit"
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text":  "Sorry, that term hasn't been added yet. If you would like to add it, please enter it below.",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "nameInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "nameEntered",
          "placeholder": {
            "type": "plain_text",
            "text": " "
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Enter a term/acronym"
        }
      },
      {
        "type": "input",
        "block_id": "descInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "descEntered",
          "multiline": true,
          "placeholder": {
            "type": "plain_text",
            "text": " "
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Enter a definition"
        }
      }
    ],
    "type": "modal",
    "callback_id": "addTerm"
  },
  deleteTermModal: {
    "title": {
      "type": "plain_text",
      "text": "Delete a Term",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Delete Term",
      "emoji": true
    },
    "type": "modal",
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "You are about to delete a term from my knowledge base! Make sure this is something you mean to do!",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "termInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "termEntered",
          "placeholder": {
            "type": "plain_text",
            "text": "Ex: AWS"
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Please type the term/acronym you want to delete.",
          "emoji": true
        }
      }
    ],
    "callback_id": "deleteTerm"
  },
  deleteTermConfirmationModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Delete Term Confirmation",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Yes, delete the term",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Are you sure you want to delete the term ",
          "emoji": true
        }
      }
    ],
    "private_metadata": "REPLACE_WITH_TERM",
    "callback_id": "deleteTermConfirmation"
  },
  addTag: {
    "title": {
      "type": "plain_text",
      "text": "Add a Tag to a Term",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "type": "modal",
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "termToTag",
        "element": {
          "type": "plain_text_input",
          "action_id": "term"
        },
        "label": {
          "type": "plain_text",
          "text": "Term:",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "tag",
        "optional": true,
        "element": {
          "type": "plain_text_input",
          "action_id": "tag"
        },
        "label": {
          "type": "plain_text",
          "text": "Write a Tag:",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "tagSelect",
        "optional": true,
        "element": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Option 1",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Option 2",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Option 3",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "tagMenu"
        },
        "label": {
          "type": "plain_text",
          "text": "Choose an existing tag:",
          "emoji": true
        }
      }
    ],
    "callback_id": "addTag"
  },
  termsModal: {
    "title": {
      "type": "plain_text",
      "text": "Terms"
    },
    "blocks": [],
    "type": "modal"
  },
  queryModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Term look up",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Need to know what a term means? Enter the term here and I'll send you a message with it's definition.",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "termInput",
        "element": {
          "type": "plain_text_input",
          "action_id": "term",
          "placeholder": {
            "type": "plain_text",
            "text": "Ex: SAIC"
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Enter a term",
          "emoji": true
        }
      }
    ],
    "callback_id": "queryTerm"
  },
  searchByTag: {
    "type": "modal",
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "title": {
      "type": "plain_text",
      "text": "Search for Terms",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "searchByTag",
        "element": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Option 1",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Option 2",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Option 3",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "searchByTag"
        },
        "label": {
          "type": "plain_text",
          "text": "Choose A Tag To Search By:",
          "emoji": true
        }
      }
    ],
    "callback_id": "searchByTag"
  },
  helpModal: {
    "title": {
      "type": "plain_text",
      "text": "Help"
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Regular commands open a pop up window for you to fill out and submit. Quick commands are one line commands that don't open a pop up window.",
          "emoji": true
        }
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Regular Commands",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "/query                                               search for a term\n/add                                                  adds a term to the database\n/edit                                                  edits a term in the database\n/delete                                              deletes a term in the database \n/terms                                               shows all terms and definitions \n /viewtags                                         shows all tags a term has \n /addtag                                             tags a term in the database  \n /searchbytag                                    searches for terms with a given tag",
          "emoji": true
        }
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Quick Commands",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "/query [term]                                    search for a term\n/add [term]: [definition]                   adds a term to the database\n/edit [term] with [definition]           edits a term in the database\n/delete [term]                                   deletes a term in the database \n/terms [letter]                                   shows terms starting with a letter\n /viewtags [term]                               shows all tags a term has \n/addtag [term]: [tag]                         tags a term in the database  \n /searchbytag [tag]                            searches for terms with a given tag",
          "emoji": true
        }
      }
    ],
    "type": "modal"
  }
}
