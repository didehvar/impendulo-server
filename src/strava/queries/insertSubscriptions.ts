const insertSubscriptions = `
  mutation insert_strava_subscriptions($objects: [strava_subscriptions_insert_input!]!) {
    insert_strava_subscriptions(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export default insertSubscriptions;
