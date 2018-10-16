const insertWebhooks = `
  mutation insert_strava_webhooks($objects: [strava_webhooks_insert_input!]!) {
    insert_strava_webhooks(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export default insertWebhooks;
