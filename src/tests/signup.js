/*
Copyright 2018 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const acceptTerms = require('./consent');
const assert = require('assert');

module.exports = async function signup(session, username, password, homeserver) {
  await session.goto(session.riotUrl('/#/register'));
  //click 'Custom server' radio button
  if (homeserver) {
    const advancedRadioButton = await session.waitAndQuerySelector('#advanced');
    await advancedRadioButton.click();
  }
  // wait until register button is visible
  await session.waitForSelector('.mx_Login_submit[value=Register]', {visible: true, timeout: 500});
  //fill out form
  const loginFields = await session.page.$$('.mx_Login_field');
  assert.strictEqual(loginFields.length, 7);
  const usernameField = loginFields[2];
  const passwordField = loginFields[3];
  const passwordRepeatField = loginFields[4];
  const hsurlField = loginFields[5];
  await session.replaceInputText(usernameField, username);
  await session.replaceInputText(passwordField, password);
  await session.replaceInputText(passwordRepeatField, password);
  if (homeserver) {
    await session.waitForSelector('.mx_ServerConfig', {visible: true, timeout: 500});
    await session.replaceInputText(hsurlField, homeserver);
  }
  //wait over a second because Registration/ServerConfig have a 1000ms
  //delay to internally set the homeserver url
  //see Registration::render and ServerConfig::props::delayTimeMs
  await session.delay(1200);
  /// focus on the button to make sure error validation
  /// has happened before checking the form is good to go
  const registerButton = await session.page.$('.mx_Login_submit');
  await registerButton.focus();
  //check no errors
  const error_text = await session.tryGetInnertext('.mx_Login_error');
  assert.strictEqual(!!error_text, false);
  //submit form
  //await page.screenshot({path: "beforesubmit.png", fullPage: true});
  await registerButton.click();

  //confirm dialog saying you cant log back in without e-mail
  const continueButton = await session.waitAndQuerySelector('.mx_QuestionDialog button.mx_Dialog_primary');
  await continueButton.click();
  //wait for registration to finish so the hash gets set
  //onhashchange better?
  await session.delay(2000);

  const url = session.page.url();
  assert.strictEqual(url, session.riotUrl('/#/home'));
}