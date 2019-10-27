const { Plugin } = require('powercord/entities')
const { ContextMenu: { Button: CMButton } } = require('powercord/components')
const { React, getModuleByDisplayName } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')


class CopyRawMessage extends Plugin {
  startPlugin () {
    this._patchContextMenu()
  }

  pluginWillUnload () {
    uninject('powercord-copy-raw-message_cm')
  }

  async _patchContextMenu () {
    const FluxMessageDevModeCMG = await getModuleByDisplayName('FluxContainer(MessageDeveloperModeGroup)')
    const MessageDevModeCMG = (new FluxMessageDevModeCMG).render().type

    inject('powercord-copy-raw-message_cm', MessageDevModeCMG.prototype, 'render', function (_, res) {
      res.props.children.push(
        React.createElement(CMButton, {
          name: 'Copy Raw Message',
          onClick: () => {
            const el = document.createElement('textarea')
            el.style.opacity = 0;
            el.value = this.props.message.content
            
            document.body.append(el)

            el.select()
            document.execCommand('copy')

            el.remove()

            // Have to find the proper method, for now this will do.
            document.body.click()
          },
        }),
      )

      return res
    })
  }
}

module.exports = CopyRawMessage
