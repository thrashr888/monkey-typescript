workflow "Test" {
  on = "push"
  resolves = ["npm:test"]
}

action "npm:install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "npm:test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  needs = ["npm:install"]
}
