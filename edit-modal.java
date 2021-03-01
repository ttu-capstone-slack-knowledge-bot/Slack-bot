{
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Edit",
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
				"type": "mrkdwn",
				"text": "*Term:* AWS"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Expanded Form:* Amazon Wb Services"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Last Updated:* Jan 17 2020"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Last Updated By:* Clay Webb"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "New Expansion of Term"
			},
			"element": {
				"type": "plain_text_input",
				"action_id": "input1",
				"placeholder": {
					"type": "plain_text",
					"text": "Type in here"
				},
				"multiline": false
			},
			"optional": false
		}
	]
}