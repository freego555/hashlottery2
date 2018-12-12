var Draw = artifacts.require('./lottery/Draw.sol')

module.exports = async function (deployer) {
  try {
    deployer.deploy(Draw).then(function (i) {
      console.log('Draw deployed success, address: ', i.address)
    })
  } catch (e) {
    console.log('Not deployed' + e.message)
  }
}
