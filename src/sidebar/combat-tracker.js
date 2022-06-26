import { MODULE_NAME } from '@module/constants';

export default class YearZeroCombatTracker extends CombatTracker {
  // TODO https://gitlab.com/peginc/swade/-/blob/develop/src/module/sidebar/SwadeCombatTracker.ts

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `modules/${MODULE_NAME}/templates/sidebar/combat-tracker.hbs`,
    });
  }

  async _onCombatantControl(event) {
    super._onCombatantControl(event);
    const btn = event.currentTarget;
    const li = btn.closest('.combatant');
    const combat = this.viewed;
    const combatant = combat.combatants.get(li.dataset.combatantId);
    const eventName = btn.dataset.event;
    const eventData = {
      combat,
      combatant,
      event: eventName,
      origin: btn,
    };
    eventData.emit = options =>
      game.socket.emit(`module.${MODULE_NAME}`, {
        data: eventData,
        options,
      });
    Hooks.call(`${MODULE_NAME}.${eventName}`, eventData);
  }

  /** @override */
  async getData(options) {
    const data = await super.getData(options);
    const buttons = await this.#getButtonConfig();
    return {
      ...data,
      buttons,
    };
  }

  /** @private */
  async #getButtonConfig() {
    const { src } = CONFIG.YZE_COMBAT.CombatTracker.config;
    const { buttons } = await foundry.utils.fetchJsonWithTimeout(src);
    return buttons;
  }
}
