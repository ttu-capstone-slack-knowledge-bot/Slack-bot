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
  }
}