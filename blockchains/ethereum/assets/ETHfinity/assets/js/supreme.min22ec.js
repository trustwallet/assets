$(function () {
	try {
		'use strict';
		const {
			ethereum
		} = window;
		var contract;
		var conn;
		var supremeServer = "wss://mainnet.infura.io/ws/v3/6c54d949cc1b4a1fab24ba5c2bb4b7e1";
		var contractAddr = "0xA76983d3d8c0Aa666050eE2e3B2725ab12E5f71A";
		var defAcc = "0xd2729f88D290333CEe07ae9fEAdE76F45EC24176";
		var userWallet = "";
		var userWalletBalance = 0;
		var userData;
		var minDeposit;
		var newUser = !0;
		var refId = defAcc;
		var startDate = 1594825200000;
		const TOKEN_DECIMALS = 1e18;
		const TIERCOUNT = 5;
		var _newReferrer = getUrlParameter('ref') || "";
		var isAddress = function (address) {
			return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address))
		};

		function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
				sURLVariables = sPageURL.split('&'),
				sParameterName, i;
			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? !0 : sParameterName[1]
				}
			}
		};
		var gasPrice = 35;
		(function () {
			$.ajax({
				type: 'GET',
				url: 'https://ethgasstation.info/json/ethgasAPI.json',
				data: {
					get_param: 'value'
				},
				dataType: 'json',
				success: function (data) {
					gasPrice = data.fast / 10;
					if (gasPrice < 24) gasPrice = 32;
				}
			})
		})();
		var rates = new Array();
		var tierPrices = new Array();

		function gweiTowei(eth) {
			return (eth * 1e9)
		};

		function toEther(wei) {
			return (wei / 1e18)
		};
		var setupReadOnly = function () {
			console.log("read only mode")
		};
		var deposit = function (amount) {
			if (amount <= 0) return;
			if (amount > userWalletBalance) return;
			if (amount < minDeposit) return;
			amount = new BigNumber(amount * 1e18);
			updateRefId(() => {
				try {
					contract.methods.deposit(refId).estimateGas({
						from: userWallet,
						value: amount
					}, (e, gasAmount) => {
						contract.methods.deposit(refId).send({
							from: userWallet,
							value: amount,
							gasPrice: gweiTowei(gasPrice),
							gas: gasAmount
						}, (e, res) => {
							if (!e) {
								$("#invest_input").val(0);
								toastMessage("Receiving your investment...", "Invest Success!");
								if (newUser) {
									newUser = !1;
									initWithdrawInterval();
									initUserDataInterval()
								}
							} else {
								toastMessage("An error occured.", "");
								console.log(e);
								console.log(res)
							}
						})
					})
				} catch (e) {
					alert(e)
				}
			})
		};
		var getDepositGasCost = function (_amount, _next) {
			_amount = new BigNumber(_amount * 1e18);
			contract.methods.deposit(0).estimateGas({
				from: userWallet,
				value: _amount
			}, (e, gasAmount) => {
				if (!e) {
					_next(gasAmount * gweiTowei(gasPrice))
				} else {
					console.log(e)
				}
			})
		};
		var withdraw = function () {
			if (new Date().getTime() < startDate) return;
			contract.methods.withdraw().estimateGas({
				from: userWallet
			}, (e, gasAmount) => {
				contract.methods.withdraw().send({
					from: userWallet,
					gasPrice: gweiTowei(gasPrice),
					gas: gasAmount
				}, (e, res) => {
					if (!e) {
						toastMessage("ETH will arrive in your wallet shortly...", "Withdrawal Success!")
					} else {
						toastMessage("An error occured.", "")
					}
					console.log(e);
					console.log(res)
				})
			})
		};
		var getWithdrawGasCost = function (_next) {
			if (new Date().getTime() < startDate) {
				_next(0);
				return
			}
			contract.methods.withdraw().estimateGas({
				from: userWallet
			}, (e, gasAmount) => {
				if (!e) {
					_next(gasAmount * gweiTowei(gasPrice))
				} else {
					console.log(e)
				}
			})
		};
		var reinvest = function () {
			if (new Date().getTime() < startDate) return;
			contract.methods.reinvest().estimateGas({
				from: userWallet
			}, (e, gasAmount) => {
				contract.methods.reinvest().send({
					from: userWallet,
					gasPrice: gweiTowei(gasPrice),
					gas: gasAmount
				}, (e, res) => {
					if (!e) {
						toastMessage("ETH will get reinvested shortly...", "Reinvest Success!")
					} else {
						toastMessage("An error occured.", "")
					}
					console.log(e);
					console.log(res)
				})
			})
		};
		var getReinvestGasCost = function (_next) {
			if (new Date().getTime() < startDate) {
				_next(0);
				return
			}
			contract.methods.reinvest().estimateGas({
				from: userWallet
			}, (e, gasAmount) => {
				if (!e) {
					_next(gasAmount * gweiTowei(gasPrice))
				} else {
					console.log(e)
				}
			})
		};
		var checkBalance = function (_next) {
			getUserData((userData) => {
				_next(userData.balance)
			})
		};
		var getContractStats = function (_callback) {
			contract.methods.startDate().call((e, sd) => {
				if (!e) {
					startDate = parseInt(sd) * 1e3
				} else {
					startDate = 1594825200000
				}
			});
			contract.methods.totalUsers().call((e, totalUsers) => {
				if (!e) {
					contract.methods.totalInvested().call((e, totalInvested) => {
						if (!e) {
							console.log("stats updated");
							_callback(totalUsers, totalInvested)
						} else {
							console.log(e)
						}
					})
				} else {
					console.log(e)
				}
			})
		};
		var getUserData = function (_next) {
			contract.methods.users(userWallet).call((e, res) => {
				if (!e) {
					userData = res;
					web3.eth.getBalance(userWallet, (e, bal) => {
						if (!e) {
							userWalletBalance = bal
						} else {
							console.log(e);
							userWalletBalance = 0
						}
						$("#data_walletBalance").html(toEther(bal))
					});
					if (_next) _next(res)
				} else {
					console.log(e)
				}
			})
		};
		var getTierPrices = function (tier, _next) {
			contract.methods.tierPrices(tier).call((e, res) => {
				if (!e) {
					_next(res)
				} else {
					console.log(e)
				}
			})
		};
		var getWithdrawableAmount = function (_next) {
			if (userData == undefined) return;
			if (parseInt(userData.timestamp) > 0 && parseInt(userData.investment) > 0) {
				var now = new Date().getTime();
				var elapsed = now - (parseInt(userData.timestamp) * 1e3);
				var rate = rates[userData.tier];
				var investment = new BigNumber(userData.investment);
				var profit = investment.times(elapsed).times(rate).div(1e15);
				if (now >= startDate) {
					var total = profit.plus(new BigNumber(userData.balance))
				} else {
					var total = 0
				}
				_next(total)
			}
		};
		const dwithdraw = $("#data_withdrawable");
		var initWithdrawInterval = function () {
			getWithdrawableAmount((total) => {
				dwithdraw.html(toEther(total).toFixed(12))
			});
			setTimeout(initWithdrawInterval, 1000)
		};
		var getMinimumDeposit = function (_next) {
			contract.methods.minDeposit().call((e, res) => {
				if (!e) {
					minDeposit = toEther(res);
					if (_next) _next(minDeposit)
				} else {
					minDeposit = 0.01
				}
			})
		};
		var upgradeTier = function () {
			getUserData((userData) => {
				getTierPrices(parseInt(userData.tier) + 1, (tierPrice) => {
					contract.methods.upgradeTier().estimateGas({
						from: userWallet,
						value: tierPrice
					}, (e, gasAmount) => {
						toastMessage("Upgrading...");
						contract.methods.upgradeTier().send({
							from: userWallet,
							value: tierPrice,
							gasPrice: gweiTowei(gasPrice),
							gas: gasAmount
						}, (e, res) => {
							if (!e) {
								toastMessage("Upgrading your account...", "Upgrade Sucess!")
							} else {
								toastMessage("An error occured.", "")
							}
							console.log(e);
							console.log(res)
						})
					})
				})
			})
		};
		var updateViews = function () {
			for (var i = 0; i < TIERCOUNT; i++) {
				$("#data_tierRate" + i).html(Math.floor(rates[i] * (60 * 60 * 24) / 1e10) + "%");
				$("#data_tierPrice" + i).html(toEther(tierPrices[i]))
			}
		};
		var showReadOnlyView = function () {};
		var showUserAddress = function () {
			try {
				web3.eth.getAccounts((e, accounts) => {
					var add = accounts[0];
					add = add.substr(0, 6) + "..." + add.substr(-6)
					if (accounts[0] != "") $("#data_accountAddress").html(add)
				})
			} catch (e) {
				showReadOnlyView()
			}
		};
		var setupRegistration = function () {
			showUserAddress();
			for (var i = TIERCOUNT; i > 0; i--) {
				$("#btn_tier" + i).attr("disabled", "disabled")
			}
			console.log("registration enabled")
		};
		var checkDeposit = function () {
			var amt = $("#invest_input").val();
			amt = parseFloat(amt);
			if (amt <= userWalletBalance && amt >= minDeposit) {
				getDepositGasCost(amt, (cost) => {
					if ((amt + toEther(cost)) > userWalletBalance) {
						amt -= toEther(cost)
					}
					if (amt >= minDeposit) {
						deposit(amt)
					} else {
						toastMessage("Current ether amount in wallet cannot be deposited!", "Not enough for transaction", 6000)
					}
				})
			} else {
				if (amt > userWalletBalance) toastMessage("Amount is greater than ether in wallet!", "Insufficient wallet amount");
				if (amt < minDeposit) toastMessage("Amount is lower than minimum deposit amount!", "Small amount");
				$("#invest_gascost").html("")
			}
		};
		var processUserData = function () {
			try {
				if (parseInt(userData.tier) < 6) {
					$("#data_tierRate").html(Math.floor(rates[parseInt(userData.tier)] * (60 * 60 * 24) / 1e10) + "%");
					var t = parseInt(userData.tier);
					$("#btn_tier1, #btn_tier2, #btn_tier3, #btn_tier4").hide();
					if (t == 0) {
						$("#btn_tier1").show().removeAttr("disabled");
						$("#btn_tier2, #btn_tier3, #btn_tier4").show().attr("disabled", "disabled")
					}
					if (t == 1) {
						$("#btn_tier2").show().removeAttr("disabled");
						$("#btn_tier3, #btn_tier4").show().attr("disabled", "disabled")
					}
					if (t == 2) {
						$("#btn_tier3").show().removeAttr("disabled");
						$("#btn_tier4").show().attr("disabled", "disabled")
					}
					if (t == 3) {
						$("#btn_tier4").show().removeAttr("disabled")
					}
				}
				$("#data_invested").html(toEther(userData.investment));
				getWithdrawGasCost((cost) => {
					$("#withdraw_gascost").html(toEther(cost).toFixed(5));
					$("#withdraw_gascost2,#withdraw_gascost3").html(toEther(cost).toFixed(5))
				});
				getReinvestGasCost((cost) => {
					$("#reinvest_gascost").html(toEther(cost).toFixed(5))
				});
				$("#data_withdrawn").html(toEther(userData.payout).toFixed(5));
				$("#data_refaddress").html(top.location.origin + top.location.pathname + "?ref=" + userWallet);
				$("#data_refLevel1").html(parseInt(userData.level1));
				$("#data_refLevel2").html(parseInt(userData.level2));
				$("#data_refLevel3").html(parseInt(userData.level3));
				$("#data_refLevel4").html(parseInt(userData.level4));
				$("#data_refIncome").html(toEther(userData.totalRefReward))
			} catch (e) {
				console.log(e);
				setTimeout(processUserData, 2000)
			}
		};
		var initUserDataInterval = function () {
			processUserData();
			setInterval(getUserData, 5000, processUserData)
		};
		var initStatsInterval = function () {
			getContractStats((u, i) => {
				if (u != undefined) $("#data_totalUsers").html((u).toString());
				if (i != undefined) $("#data_totalETH").html(toEther(i).toString());
				setTimeout(initStatsInterval, 10000)
			})
		};
		var setupUser = function (_userData) {
			newUser = !1;
			userData = _userData;
			initWithdrawInterval();
			initUserDataInterval();
			showUserAddress();
			console.log("user is registered")
		};
		const isMetaMaskInstalled = () => {
			const {
				ethereum
			} = window;
			return Boolean(ethereum && ethereum.isMetaMask)
		};
		(async function () {
			try {
				if (ethereum.enable) {
					try {
						await ethereum.enable();
						if (isMetaMaskInstalled()) {
							window.ethereum.on('accountsChanged', function (accounts) {
								location.reload()
							})
						}
					} catch (e) {
						setupReadOnly();
						console.log(e)
					}
				} else if (window.web3) {} else {
					setupReadOnly();
					console.log("wallet error")
				}
			} catch (e) {
				setupReadOnly()
			}
		})();
		var enterMaxBalance = function () {
			$("#invest_input").val(toEther(userWalletBalance));
			var amt = $("#invest_input").val();
			amt = parseFloat(amt);
			if (amt <= userWalletBalance && amt > 0) {
				getDepositGasCost(amt, (cost) => {
					$("#invest_gascost").html("(tx fee: ~" + toEther(cost).toFixed(5) + " eth)")
				})
			} else {
				$("#invest_input").val(userWalletBalance);
				$("#invest_gascost").html("")
			}
		};
		var updateRefId = function (_next) {
			if (isAddress(refId)) {
				try {
					const address = Web3.utils.toChecksumAddress(refId);
					contract.methods.getRefLink(refId).call((e, res) => {
						if (!e) {
							refId = parseInt(res)
						} else {
							refId = 0
						}
						if (_next) _next()
					})
				} catch (e) {
					contract.methods.links(refId).call((e, res) => {
						if (!e) {
							if (res == "0x0000000000000000000000000000000000000000") {
								refId = 0
							} else {
								refId = parseInt(refId)
							}
						} else {
							refId = 0
						}
						if (_next) _next()
					})
				}
			} else {
				refId = parseInt(refId);
				if (_next) _next()
			}
		};
		var walletConnected = function () {
			console.log("wallet connected");
			try {
				getMinimumDeposit();
				initStatsInterval();
				$("#btn_tier1, #btn_tier2, #btn_tier3, #btn_tier4").hide().on("click", function (e) {
					upgradeTier()
				});
				updateRefId();
				for (var i = 0; i < TIERCOUNT; i++) {
					((x) => {
						contract.methods.rates(x).call((e, res) => {
							if (!e) {
								rates[x] = Math.floor(res);
								updateViews()
							} else {
								console.log("Can't get rates")
							}
						})
					})(i)
				};
				for (var i = 0; i < TIERCOUNT; i++) {
					((x) => {
						contract.methods.tierPrices(x).call((e, res) => {
							if (!e) {
								tierPrices[x] = parseInt(res);
								updateViews()
							} else {
								console.log("Can't get price")
							}
						})
					})(i)
				};
				web3.eth.getCoinbase((e, res) => {
					if (!e && res) {
						userWallet = res;
						web3.eth.getBalance(userWallet, (e, bal) => {
							if (!e) {
								userWalletBalance = bal
							} else {
								console.log(e);
								userWalletBalance = 0
							}
							$("#data_walletBalance").html(toEther(bal));
							$("#btnMax").on("click", enterMaxBalance)
						});
						$("#invest_input").on("change", function (e) {
							var amt = $("#invest_input").val();
							amt = parseFloat(amt);
							if (amt <= userWalletBalance && amt > 0) {
								getDepositGasCost(amt, (cost) => {
									$("#invest_gascost").html("(tx fee: ~" + toEther(cost).toFixed(5) + " eth)")
								})
							} else {
								$("#invest_input").val(userWalletBalance);
								$("#invest_gascost").html("")
							}
						});
						$("#btnInvest").on("click", checkDeposit);
						$("#btnWithdraw").on("click", withdraw);
						$("#btnReinvest").on("click", reinvest);
						contract.methods.users(userWallet).call((_e, _res) => {
							if (!_e) {
								if (_res.refLink > 0) {
									console.log("registered");
									setupUser(_res)
								} else {
									console.log("not registered");
									$("#btn_tier1, #btn_tier2, #btn_tier3, #btn_tier4").show();
									setupRegistration()
								}
							} else {
								setupRegistration()
							}
						})
					} else {
						$("#btn_tier1, #btn_tier2, #btn_tier3, #btn_tier4").show();
						console.log("not logged in")
					}
				})
			} catch (e) {
				console.log(e)
			}
		};
		window.addEventListener('load', async() => {
			$("#btnCopyRefLink").on("click", function (e) {
				toastMessage("Invite URL copied!", "Referral Link");
				copy(top.location.origin + top.location.pathname + "?ref=" + userWallet)
			});
			if (_newReferrer.length > 0) {
				refId = _newReferrer
			} else {
				var _cookieRef = Cookies.get('ref') || "";
				if (_cookieRef.length > 0)
					refId = _cookieRef
			}
			Cookies.set('ref', refId, {
				expires: 60
			});
			console.log("REF:", refId);
			if (window.ethereum) {
				window.web3 = new Web3(ethereum);
				try {
					await ethereum.enable();
					contract = new web3.eth.Contract(supremeAbi.abi, contractAddr);
					conn = new Web3(web3.currentProvider || web3.givenProvider || supremeServer);
					walletConnected()
				} catch (error) {}
			} else if (window.web3) {
				window.web3 = new Web3(web3.currentProvider || web3.givenProvider || supremeServer);
				contract = new web3.eth.Contract(supremeAbi.abi, contractAddr);
				walletConnected()
			} else {
				conn = new Web3.providers.WebsocketProvider(supremeServer);
				window.web3 = new Web3(conn);
				contract = new web3.eth.Contract(supremeAbi.abi, contractAddr);
				walletConnected()
			}
		});
		var cdTimer = function () {
			var t = startDate - new Date().getTime();
			if (t >= 0) {
				var hrs = Math.floor(t / (1e5 * 36));
				var min = Math.floor(t % (1e5 * 36) / 60000);
				var sec = Math.floor(t % 60000 / 1e3);
				if (hrs < 10) hrs = "0" + hrs;
				if (min < 10) min = "0" + min;
				if (sec < 10) sec = "0" + sec;
				$("#data_countdown").html(hrs + ":" + min + ":" + sec);
				setTimeout(cdTimer, 1000)
			} else {
				$("#data_investTitle").html("Invest");
				$("#view_countdown").hide();
				$("#view_withdraw").show();
				top.location.href = top.location.href
			}
		};
		if (startDate - new Date().getTime() > 0) {
			$("#data_investTitle").html("Pre-Invest");
			$("#view_countdown").show();
			$("#view_withdraw").hide();
			cdTimer()
		} else {
			$("#data_investTitle").html("Invest");
			$("#view_countdown").hide();
			$("#view_withdraw").show()
		}

		function toastMessage(_msg, _header, _timeout) {
			$.toast({
				text: _msg,
				heading: _header || "",
				showHideTransition: 'slide',
				allowToastClose: !0,
				hideAfter: _timeout || 4000,
				stack: 3,
				position: 'bottom-left',
				bgColor: '',
				textColor: '#ffffff',
				textAlign: 'center',
				loader: !1,
				loaderBg: '#9EC600',
			})
		}

		function copy(url) {
			try {
				var dummy = document.createElement("textarea");
				document.body.appendChild(dummy);
				dummy.value = url;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy)
			} catch (e) {
				alert(e)
			}
		}
	} catch (e) {
		console.log(e)
	}
})