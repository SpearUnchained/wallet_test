// walletConnector.js
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet"; // Example additional wallet

let walletSelector = null;
let currentAccountId = null;

// Initialize Wallet Selector with specified wallets
async function initializeWalletSelector(wallets) {
    const modules = [];

    // Dynamically add wallets based on input
    if (wallets.includes("meteor")) {
        modules.push(setupMeteorWallet());
    }
    if (wallets.includes("near")) {
        modules.push(setupNearWallet());
    }
    
    walletSelector = await setupWalletSelector({
        network: "testnet", // Change to 'mainnet' if needed
        modules: modules,
    });
}

// Connect to the wallet and fetch the account ID
async function connectWallet(wallets = ["meteor"]) {
    if (!walletSelector) await initializeWalletSelector(wallets);

    try {
        const [wallet] = walletSelector.getAccounts();
        if (!wallet) {
            await walletSelector.show(); // Show wallet selector if no account connected
        }
        const accounts = walletSelector.getAccounts();
        currentAccountId = accounts[0]?.accountId || null;
        return currentAccountId;
    } catch (error) {
        console.error("Error connecting to NEAR wallet:", error);
        return null;
    }
}

// Function to return current account ID
function getCurrentAccountId() {
    return currentAccountId;
}

// Expose functions to Unity via Module
Module.onRuntimeInitialized = () => {
    window.connectNEARWallet = async (walletList) => {
        const accountId = await connectWallet(walletList);
        return accountId;
    };

    window.getNEARAccountId = () => {
        return getCurrentAccountId();
    };
};
