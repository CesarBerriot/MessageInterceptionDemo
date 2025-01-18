/**
 * @name MessageInterceptionDemo
 * @author César Berriot
 * @version 1.0.0
 * @description Showcase plugin that intercepts messages by hooking discord internals.
 * @website https://github.com/CesarBerriot
 * @source https://github.com/CesarBerriot/MessageInterceptionDemo
 * @updateUrl https://raw.githubusercontent.com/CesarBerriot/MessageInterceptionDemo/master/MessageInterceptionDemo.plugin.js
 */

module.exports = class {
    start() {
        this.dispatcherModule = window.BdApi.Webpack.getByKeys("dispatch", "subscribe");
        if(!this.dispatcherModule) {
            this.alert("Failed to load", "Couldn't find dispatcher module through WebPack");
            return;
        }

        try {
            this.unhook = window.BdApi.Patcher.before('', this.dispatcherModule, 'dispatch', (dispatcher, dispatchArguments, originalDispatchArguments) => this.dispatchHook(dispatchArguments));
        } catch(error) {
            this.alert("Failed to load", `Patcher failed to monkey patch with error : ${error}`);
        }

        this.alert("Successfully loaded", "");
    }

    stop() {
        try {
            this.unhook()
        } catch(error) {
            this.alert("Failed to unload", `Failed to unhook monkey patch with error : ${error}`)
        }
        this.alert("Successfully unloaded", "")
    }

    dispatchHook(args, original) {
        if(args[0].type == 'MESSAGE_CREATE')
            this.alert(
                "Message Received",
                [
                    `Guild ID : ${args[0].guildId}`,
                    `Channel ID : ${args[0].channelId}`,
                    `Author Account ID : ${args[0].message.author.id}`,
                    `Author Account Username : ${args[0].message.author.username}`,
                    `Content : ${args[0].message.content}`
                ]
            );
    }

    alert(title, message) {
        window.BdApi.UI.alert("[MessageInterceptionDemo] " + title, message);
    }
}