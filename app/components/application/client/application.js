{
  netzkeRoutes: {
    ":component": "onNavigateToComponent"
  },

  initComponent: function() {
    this.callParent();

    this.navigation = this.down('panel[itemId="navigation"]');
    this.mainPanel = this.down('panel[itemId="main_panel"]');
    this.infoPanel = this.down('panel[itemId="info_panel"]');

    this.on('afterrender', function() {
      if (this.introHtml) this.updateInfo(this.introHtml);
    }, this);

    this.navigation.on('select', function(m, r) {
      if (r.raw.cmp) this.netzkeNavigateTo(r.raw.cmp);
    }, this);
  },

  onNavigateToComponent: function(cmp){
    var node = this.navigation.getStore().getById(cmp);
    this.navigation.getSelectionModel().select(node);
    this.netzkeLoadComponent(cmp, {container: this.mainPanel, callback: function(cmp) {
      this.updateInfo(cmp.desc);
    }, scope: this});
  },

  updateInfo: function(html) {
    this.infoPanel.body.update("<img style='position: relative; top: 3px; margin-right: 3px;' src='/images/icons/information.png' />" + html);
  },

  netzkeOnAbout: function() {
    Ext.Msg.show({
      width: 450,
      height: 220,
      title: "Netzke Demo",
      buttons: Ext.Msg.OK,
      icon: Ext.MessageBox.INFO,
      msg: '<p>Explore demo <a target="_blank" href="http://netzke.org">Netzke</a> components along with their source code. <p/> \
        <p>Follow <a target="_blank" href="http://twitter.com/netzke">@netzke</a> on Twitter for the latest news on the framework. <p/> \
        <p>The source code is on <a target="_blank" href="https://github.com/netzke/netzke-demo">Github</a>. <p/> \
        <div style="text-align: right">By <a target="_blank" href="http://twitter.com/mxgrn">Max Gorin</a>, ' + (new Date()).getFullYear() + '</div> \
        '
    });
  },

  netzkeOnSignIn: function() {
    var me = this;
    this.signinWin = this.signinWin || Ext.create('widget.window', {
      width: 300, height: 200, modal: true, layout: 'fit', closeAction: 'hide',

      title: "Sign in",

      fbar: [
        {text: 'OK', handler: function() {
          var form = this.up('window').items.first(),
              values = form.getForm().getValues();

          // calling the endpoint
          me.signIn(values, function(res){
            if (res) {
              this.signinWin.close();
              Ext.Msg.show({title: "Signed in", msg: "Signed in successfully, reloading the application...", icon: Ext.Msg.INFO, closable: false});
              window.location = window.location;
            }
          });
        }},
        {text:'Cancel', handler: function() {
          this.up('window').close();
        }}
      ],

      items: {
        xtype: 'form', bodyPadding: 10,
        defaultType: 'textfield',
        items: [{
          xtype: 'displayfield', value: '<img src="/images/icons/information.png">&nbsp;Signing in will add a logout button to the menu bar and an extra component.</img>'
        },{
          xtype: 'displayfield'
        },{
          fieldLabel: 'Email', name: 'email', value: 'demo@netzke.org'
        },{
          fieldLabel: 'Password', name: 'password', inputType: 'password', value: 'netzke'
        }]
      }
    });

    this.signinWin.show();
  },

  netzkeOnSignOut: function() {
    this.signOut(null, function(success) {
      if (success) {
        Ext.Msg.show({title: "Signed out", msg: "Signed out, reloading the application...", icon: Ext.Msg.INFO, closable: false});
        window.location = window.location;
      }
    })
  }
}
