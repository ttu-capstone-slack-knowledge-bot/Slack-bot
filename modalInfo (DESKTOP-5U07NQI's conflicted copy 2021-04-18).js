module.exports = {
  firstModal: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "My App",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Awesome",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Whatever",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "HEY! I'M A FRICKEN MODAL!"
        },
        "accessory": {
          "type": "image",
          "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSjriUQ6OtX5mGR9OVsfepnvFP9Szvw3XIIA&usqp=CAU",
          "alt_text": "cute cat"
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
    type: 'home',
    blocks: [
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
          "text": "• Need to know what a term means? STILL IN PROGRESS WITH MODAL IMPLEMENTATION\n\n• Want to tell me something and help me learn! Then you can use the slash command */add* and I'll make sure to remember that for the next time somebody asks.\n\n• Made a mistake creating a new term, or caught somebody else's? Then just use */edit* and you can tell me what term you need to edit and what it should be changed to!\n\n• Want a simple help message without leaving the channel you're currently in? IN PROGRESS WITH MODAL IMPLEMENTATION!\n\n• Want to add a tag to a term? IN PROGRESS WITH MODAL IMPLEMENTATION."
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me",
              "emoji": true
            },
            "value": "click_me_123",
            "action_id": "Open-Edit"
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
        "optional": false,
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
          "text": "Please type the term/acronym you want to delete?",
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
  }
}