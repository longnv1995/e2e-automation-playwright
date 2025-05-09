import { test, expect } from '@fixtures/baseUIFixture';
import { mockCartResponse } from 'src/mock-api/common-mock-api';
import cartItems from '../fixtures/cartItems.json';
import AddressData from '@pages/common/data/address';
import { PaymentMethodLabel } from '@pages/checkout/types';

test.describe('[Visual tests] Checkout feature', async () => {
	test.use({ storageState: './playwright/.auth/customer01.json' });

	test('Checkout flow', async ({ page, navComponent, checkoutPage }) => {
		await test.step('Snapshot cart step...', async () => {
			await mockCartResponse(
				{
					status: 200,
					json: cartItems,
				},
				page
			);
			await navComponent.openCheckoutPageURL();
			await navComponent.expectNavigateToCheckoutPage();
			await expect(checkoutPage.checkoutForm).toHaveScreenshot('cart-step.png');
		});

		await checkoutPage.clickProcessToCheckout();
		await checkoutPage.expectNavigateToSignedInStep();

		await test.step('Snapshot billing address step', async () => {
			await checkoutPage.clickProcessToCheckout();
			await checkoutPage.expectToNavigateToBillingAddressStep();
			await checkoutPage.addressComponent.fillAddressForm(
				AddressData.address01
			);
			await expect(checkoutPage.checkoutForm).toHaveScreenshot(
				'billing-address-step.png'
			);
		});

		await checkoutPage.clickProcessToCheckout();
		await checkoutPage.expectNavigateToPaymentStep();

		await test.step('Snapshot payment method: Bank Transfer', async () => {
			await checkoutPage.paymentComponent.selectPaymentMethod(
				PaymentMethodLabel.bankTransfer
			);
			await expect(checkoutPage.checkoutForm).toHaveScreenshot(
				'bank-transfer-payment-method.png'
			);
		});

		await test.step('Snapshot payment method: Credit Card', async () => {
			await checkoutPage.paymentComponent.selectPaymentMethod(
				PaymentMethodLabel.bankTransfer
			);
			await expect(checkoutPage.checkoutForm).toHaveScreenshot(
				'credit-card-payment-method.png'
			);
		});

		await test.step('Snapshot payment method: Gift Card', async () => {
			await checkoutPage.paymentComponent.selectPaymentMethod(
				PaymentMethodLabel.bankTransfer
			);
			await expect(checkoutPage.checkoutForm).toHaveScreenshot(
				'gitf-card-payment-method.png'
			);
		});
	});
});
