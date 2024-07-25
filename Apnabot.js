// const { ActivityHandler, MessageFactory } = require('botbuilder');
// const { MakeReservationDialog } = require('./componentDialogs/makeresrvationDialog');

// class ApnaBot extends ActivityHandler {
//     constructor( _conversationState , _userState) {
//         super();

//         this._conversationState = _conversationState;
//         this._userState = this._userState;

//         this.dialogState = _conversationState.createProperty("dialogState");
//         this.makeReservationDialog = new MakeReservationDialog(this._conversationState,this._userState);

//         this.previousIntent = this._conversationState.createProperty("previousIntent");
//         this.conversationData = this._conversationState.createProperty("conversationData");

//         // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
//         this.onMessage(async (context, next) => {
            
//         await this.dispatchToIntentAsync(context);
//         // By calling next() you ensure that the next BotHandler is run.
//         await next();

//         });

//     this.onDialog(async (context, next) => {

//             //save any state changes.The load happened during the execution of the Dialog
//             await this._conversationState.saveChanges(context, false);
//             await this._userState.saveChanges(context, false);
//             await next();
//         });

//     this.onMembersAdded(async (context, next) => {
//            await this.sendWelcomeMessage(context)
//             // By calling next() you ensure that the next BotHandler is run.
//             await next();
//         });
//     }

//     async sendWelcomeMessage(turnContext){
//         const { activity } = turnContext;
        
//         //Iterate over all members added to the conversation
//         for (const idx in activity.membersAdded) {
//             if (activity.membersAdded[idx].id !== activity.recipient.id){
//                 const welcomeMessage = `Welcome to Restaurant Reservation Bot ${ activity.membersAdded[idx].name }. `;
//                 await turnContext.sendActivity(welcomeMessage);
//                 await this.sendSuggestedActions(turnContext);
//             }
//         }
//     }

//     async sendSuggestedActions(turnContext){
//         var reply = MessageFactory.suggestedActions(['Make Reservation','Cancel Reservation',' Restaurant Address'],'What would like to do today Sir ?');
//         await turnContext.sendActivity(reply);
//     }

//     async dispatchToIntentAsync(context){
        
//         var currentIntent = '';
//         const previousIntent = await this.previousIntent.get(context,{});
//         const conversationData = await this.conversationData.get(context,{});

//         if(previousIntent.intentName && conversationData.endDialog === false)
//         {
//             currentIntent = previousIntent.intentName;
//         }
//         else if(previousIntent.intentName && conversationData.endDialog === true)
//         {
//            currentIntent = context.activity.text;
//         }
//         else
//         {
//            currentIntent = context.activity.test;
//            await this.previousIntent.set(context,{intentName: context.activity.text });
//         }
//     switch(currentIntent)
//     {
//             case 'Make Reservation':
//             console.log("Inside Make Reservation Case");

//             await this.conversationData.set(context,{endDialog: false});
//             await this.makeReservationDialog.run(context,this.dialogState);
//             conversationData.endDialog = await this.makeReservationDialog.isDialogComplete();
//             if(conversationData.endDialog)
//             {
//                 await this.sendSuggestedActions(context);
//             }

//             break;


//             default:
//                 console.log("Did not match Make Reservation Case");
//                 break;
//     }

//     }
// }

// module.exports.ApnaBot = ApnaBot;


const { ActivityHandler, MessageFactory } = require('botbuilder');
const { MakeReservationDialog } = require('./componentDialogs/makeresrvationDialog');

class ApnaBot extends ActivityHandler {
    constructor(_conversationState, _userState) {
        super();

        this._conversationState = _conversationState;
        this._userState = _userState;

        this.dialogState = _conversationState.createProperty('dialogState');
        this.makeReservationDialog = new MakeReservationDialog(this._conversationState, this._userState);

        this.previousIntent =this._conversationState.createProperty('previousIntent');
        this.conversationData = this._conversationState.createProperty('conversationData');

        // Handle incoming messages
        this.onMessage(async (context, next) => {
            await this.dispatchToIntentAsync(context);
            await next();
        });

        // Save state changes during dialog
        this.onDialog(async (context, next) => {
            await this._conversationState.saveChanges(context, false);
            await this._userState.saveChanges(context, false);
            await next();
        });

        // Handle members added to conversation
        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            await next();
        });
    }

    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id){
                const welcomeMessage = `Welcome to Restaurant Reservation Bot ${ activity.membersAdded[idx].name }. `;
                await turnContext.sendActivity(welcomeMessage);
                await this.sendSuggestedActions(turnContext);
            }
        }
    }

    async sendSuggestedActions(turnContext) {
        const reply = MessageFactory.suggestedActions(
            ['Make Reservation', 'Cancel Reservation', 'Restaurant Address'],
            'What would you like to do today?'
        );
        await turnContext.sendActivity(reply);
    }

    async dispatchToIntentAsync(context) {
        let currentIntent = '';
        const previousIntent = await this.previousIntent.get(context, {});
        const conversationData = await this.conversationData.get(context, {});

        if (previousIntent.intentName && conversationData.endDialog === false) {
            currentIntent = previousIntent.intentName;
        } else if (previousIntent.intentName && conversationData.endDialog === true) {
            currentIntent = context.activity.text;
        } else {
            currentIntent = context.activity.text;
            await this.previousIntent.set(context, { intentName: context.activity.text });
        }

        switch (currentIntent) {
            case 'Make Reservation':
            console.log('Inside Make Reservation Case');

            await this.conversationData.set(context,{endDialog: false});
            await this.makeReservationDialog.run(context, this.dialogState);
            conversationData.endDialog = await this.makeReservationDialog.isDialogComplete();
            if(conversationData.endDialog)
            {
                await this.sendSuggestedActions(context);
            }

            break;

            default:
                console.log('Did not match any specific case');
                break;
        }
    }
}

module.exports.ApnaBot = ApnaBot;

