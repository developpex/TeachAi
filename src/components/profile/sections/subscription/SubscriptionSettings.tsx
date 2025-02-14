import { CreditCard, History, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.tsx';
import { SubscriptionStatus } from '../../../subscription/SubscriptionStatus.tsx';
import type { BillingHistoryItem } from '../../../../types';
import {PLAN} from "../../../../utils/constants.ts";

interface PaymentMethodProps {
  cardDetails: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

interface BillingHistoryTableProps {
  billingHistory: BillingHistoryItem[];
}

function PaymentMethod({ cardDetails }: PaymentMethodProps) {
  if (!cardDetails) {
    return (
      <div className="p-4 bg-sage/5 rounded-lg text-center">
        <p className="text-primary">No payment method on file</p>
      </div>
    );
  }

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div className="p-4 border border-sage/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-primary-dark">
              {formatCardBrand(cardDetails.brand)} •••• {cardDetails.last4}
            </p>
            <p className="text-sm text-primary">
              Expires {cardDetails.expMonth.toString().padStart(2, '0')}/{cardDetails.expYear}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingHistoryTable({ billingHistory }: BillingHistoryTableProps) {
  if (!billingHistory?.length) {
    return (
      <div className="p-4 bg-sage/5 rounded-lg text-center">
        <p className="text-primary">No billing history available</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-mint/20 text-primary';
      case 'open':
        return 'bg-sky/20 text-primary-dark';
      case 'void':
      case 'uncollectible':
        return 'bg-coral/20 text-accent-dark';
      default:
        return 'bg-sage/20 text-primary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-sage/20">
            <th className="pb-3 text-sm font-medium text-primary">Date</th>
            <th className="pb-3 text-sm font-medium text-primary">Invoice</th>
            <th className="pb-3 text-sm font-medium text-primary">Amount</th>
            <th className="pb-3 text-sm font-medium text-primary">Status</th>
            <th className="pb-3 text-sm font-medium text-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {billingHistory.map((invoice) => (
            <tr key={invoice.id} className="border-b border-sage/10">
              <td className="py-4 text-sm text-primary-dark">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="py-4 text-sm text-primary-dark">
                {invoice.number}
              </td>
              <td className="py-4 text-sm text-primary-dark">
                ${invoice.amount.toFixed(2)}
              </td>
              <td className="py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </td>
              <td className="py-4">
                <div className="flex items-center space-x-3">
                  {invoice.pdfUrl && (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-accent-dark flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </a>
                  )}
                  {invoice.hostedUrl && (
                    <a
                      href={invoice.hostedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-accent-dark flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubscriptionSettings() {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <SubscriptionStatus />

      {/* Payment Method */}
      {(userProfile?.plan === PLAN.PLUS || userProfile?.isTrialActive) && (
        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-mint/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-dark">Payment Method</h3>
                <p className="text-sm text-primary">Manage your payment details</p>
              </div>
            </div>
          </div>

          <PaymentMethod cardDetails={userProfile.cardDetails} />
        </div>
      )}

      {/* Billing History */}
      {(userProfile?.plan === PLAN.PLUS || userProfile?.isTrialActive) && (
        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-mint/20 rounded-lg">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Billing History</h3>
              <p className="text-sm text-primary">View your payment history</p>
            </div>
          </div>

          <BillingHistoryTable billingHistory={userProfile.billingHistory || []} />
        </div>
      )}
    </div>
  );
}