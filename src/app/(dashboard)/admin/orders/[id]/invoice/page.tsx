'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Mail, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function OrderInvoicePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params using React.use
  const unwrappedParams = use(params as Promise<{ id: string }>);
  const orderId = unwrappedParams.id;
  
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!order) return;
    
    setIsDownloading(true);
    try {
      // Create a PDF directly with jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add company details
      doc.setFontSize(24);
      doc.text('INVOICE', 20, 20);
      doc.setFontSize(12);
      doc.text(`# ${order.orderNumber}`, 20, 27);
      
      doc.setFontSize(14);
      doc.text('Urbaniq', 170, 20, { align: 'right' });
      doc.setFontSize(10);
      doc.text('123 Commerce Street', 170, 27, { align: 'right' });
      doc.text('New York, NY 10001', 170, 32, { align: 'right' });
      doc.text('support@urbaniq.com', 170, 37, { align: 'right' });
      
      // Add billing info
      doc.setFontSize(11);
      doc.text('BILL TO:', 20, 50);
      doc.setFontSize(10);
      doc.text(order.customerName || 'Customer', 20, 57);
      doc.text(order.customerEmail || '', 20, 62);
      
      // Add shipping address if available
      let yPos = 67;
      if (order.shippingAddress) {
        let address;
        if (typeof order.shippingAddress === 'string') {
          address = JSON.parse(order.shippingAddress);
        } else {
          address = order.shippingAddress;
        }
        
        doc.text(address.line1, 20, yPos);
        yPos += 5;
        if (address.line2) {
          doc.text(address.line2, 20, yPos);
          yPos += 5;
        }
        doc.text(`${address.city}, ${address.state} ${address.postal_code}`, 20, yPos);
        yPos += 5;
        doc.text(address.country, 20, yPos);
      }
      
      // Add invoice details
      doc.setFontSize(11);
      doc.text('INVOICE DETAILS:', 170, 50, { align: 'right' });
      doc.setFontSize(10);
      
      // Position labels on left side and values on right, with more space between them
      doc.text('Invoice Date:', 120, 57);
      doc.text(formatDate(order.createdAt), 170, 57, { align: 'right' });
      
      doc.text('Order Date:', 120, 62);
      doc.text(formatDate(order.createdAt), 170, 62, { align: 'right' });
      
      doc.text('Payment Status:', 120, 67);
      doc.text('Paid', 170, 67, { align: 'right' });
      
      doc.text('Payment Method:', 120, 72);
      const paymentMethod = order.paymentMethod 
        ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) 
        : '';
      doc.text(paymentMethod, 170, 72, { align: 'right' });
      
      // Add items table header
      yPos = 90;
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPos - 5, 170, 10, 'F');
      
      doc.text('Item', 25, yPos);
      doc.text('Quantity', 120, yPos, { align: 'right' });
      doc.text('Price', 145, yPos, { align: 'right' });
      doc.text('Total', 170, yPos, { align: 'right' });
      
      // Add items
      yPos += 10;
      order.items.forEach((item: any) => {
        doc.text(item.name, 25, yPos);
        
        if (item.description) {
          doc.setTextColor(120);
          doc.setFontSize(8);
          doc.text(item.description.slice(0, 40) + (item.description.length > 40 ? '...' : ''), 25, yPos + 4);
          doc.setTextColor(0);
          doc.setFontSize(10);
        }
        
        doc.text(item.quantity.toString(), 120, yPos, { align: 'right' });
        doc.text(`$${item.price.toFixed(2)}`, 145, yPos, { align: 'right' });
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos, { align: 'right' });
        
        yPos += item.description ? 15 : 10;
        
        // Add page if needed
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      // Add totals
      yPos += 10;
      doc.text('Subtotal:', 140, yPos);
      doc.text(`$${order.subtotal.toFixed(2)}`, 170, yPos, { align: 'right' });
      
      yPos += 5;
      doc.text('Tax:', 140, yPos);
      doc.text(`$${order.tax.toFixed(2)}`, 170, yPos, { align: 'right' });
      
      yPos += 5;
      doc.text('Shipping:', 140, yPos);
      doc.text(`$${order.shippingCost.toFixed(2)}`, 170, yPos, { align: 'right' });
      
      yPos += 7;
      doc.setLineWidth(0.1);
      doc.line(140, yPos - 2, 170, yPos - 2);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 140, yPos + 5);
      doc.text(`$${order.total.toFixed(2)}`, 170, yPos + 5, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      // Add footer
      yPos = 270;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Thank you for your business!', 105, yPos, { align: 'center' });
      doc.setFontSize(8);
      doc.text('If you have any questions about this invoice, please contact support@urbaniq.com', 105, yPos + 5, { align: 'center' });
      
      // Save the PDF
      doc.save(`Invoice-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmail = () => {
    if (!order?.customerEmail) return;
    
    // Prepare email body with invoice details
    const subject = encodeURIComponent(`Invoice #${order.orderNumber} from Urbaniq`);
    const body = encodeURIComponent(
      `Dear ${order.customerName || 'Customer'},\n\n` +
      `Please find attached your invoice #${order.orderNumber} for your recent order from Urbaniq.\n\n` +
      `Order Date: ${formatDate(order.createdAt)}\n` +
      `Order Total: $${order.total.toFixed(2)}\n\n` +
      `Thank you for your business!\n\n` +
      `Urbaniq Team`
    );
    
    // Open default email client with pre-filled fields
    window.location.href = `mailto:${order.customerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full">
      {/* Non-printable header with actions */}
      <div className="flex justify-end gap-4 mb-8 print:hidden">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-gray-200 bg-white rounded-md shadow-none"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-gray-200 bg-white rounded-md shadow-none"
            onClick={handleDownload}
            disabled={isDownloading || !order}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> Download
              </>
            )}
          </Button>
          {order?.customerEmail && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border border-gray-200 bg-white rounded-md shadow-none"
              onClick={handleEmail}
            >
              <Mail className="h-4 w-4 mr-2" /> Email
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : loading ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8">
          <div className="flex justify-between mb-8">
            <Skeleton className="h-10 w-32" />
            <div className="text-right">
              <Skeleton className="h-6 w-48 ml-auto mb-2" />
              <Skeleton className="h-4 w-40 ml-auto mb-1" />
              <Skeleton className="h-4 w-36 ml-auto mb-1" />
              <Skeleton className="h-4 w-32 ml-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-4/5 mb-1" />
              <Skeleton className="h-4 w-3/5 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-36 ml-auto mb-3" />
              <Skeleton className="h-4 w-48 ml-auto mb-1" />
              <Skeleton className="h-4 w-40 ml-auto mb-1" />
              <Skeleton className="h-4 w-44 ml-auto" />
            </div>
          </div>
          <Skeleton className="h-72 w-full mb-8" />
          <div className="w-1/3 ml-auto">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      ) : order ? (
        <div id="invoice-content" className="bg-white border border-gray-100 rounded-lg p-8 print:border-0 print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">INVOICE</h2>
              <p className="text-gray-500 font-medium"># {order.orderNumber}</p>
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <div className="text-xl font-semibold text-gray-900">Urbaniq</div>
              <div className="text-gray-500 mt-1">123 Commerce Street</div>
              <div className="text-gray-500">New York, NY 10001</div>
              <div className="text-gray-500">support@urbaniq.com</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm tracking-wider">Bill To:</h3>
              <div className="text-gray-700">
                <div className="font-medium">{order.customerName || 'Customer'}</div>
                <div>{order.customerEmail}</div>
                {order.shippingAddress && typeof order.shippingAddress === 'string'
                  ? (() => {
                      const address = JSON.parse(order.shippingAddress);
                      return (
                        <div className="mt-2">
                          {address.line1}
                          {address.line2 && <><br />{address.line2}</>}
                          <br />
                          {address.city}, {address.state} {address.postal_code}
                          <br />
                          {address.country}
                        </div>
                      );
                    })()
                  : order.shippingAddress && (
                    <div className="mt-2">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                      <br />
                      {order.shippingAddress.country}
                    </div>
                  )
                }
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm tracking-wider">Invoice Details:</h3>
              <table className="w-full sm:w-auto ml-auto">
                <tbody>
                  <tr>
                    <td className="pb-2 pr-4 text-gray-500 text-right">Invoice Date:</td>
                    <td className="pb-2 text-gray-700 font-medium text-right">{formatDate(order.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="pb-2 pr-4 text-gray-500 text-right">Order Date:</td>
                    <td className="pb-2 text-gray-700 font-medium text-right">{formatDate(order.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="pb-2 pr-4 text-gray-500 text-right">Payment Status:</td>
                    <td className="pb-2 text-gray-700 font-medium text-right">Paid</td>
                  </tr>
                  <tr>
                    <td className="pb-2 pr-4 text-gray-500 text-right">Payment Method:</td>
                    <td className="pb-2 text-gray-700 font-medium text-right capitalize">{order.paymentMethod}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-50 text-left font-medium text-gray-600 text-sm uppercase tracking-wider rounded-tl-lg">Item</th>
                  <th className="py-3 px-4 bg-gray-50 text-right font-medium text-gray-600 text-sm uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 bg-gray-50 text-right font-medium text-gray-600 text-sm uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 bg-gray-50 text-right font-medium text-gray-600 text-sm uppercase tracking-wider rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item: any, index: number) => (
                  <tr key={item.id} className={index !== order.items.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-4 px-4 text-gray-800">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-gray-500 text-sm mt-1">{item.description}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 md:w-2/5 lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800 font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-800 font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800 font-medium">${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="h-px w-full bg-gray-200 my-2"></div>
                <div className="flex justify-between py-2 font-medium">
                  <span className="text-gray-900 text-lg">Total:</span>
                  <span className="text-gray-900 text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center text-gray-500">
            <p className="font-medium text-gray-700">Thank you for your business!</p>
            <p className="mt-2 text-sm">If you have any questions about this invoice, please contact support@urbaniq.com</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 text-gray-500 p-8 rounded-lg text-center">
          Order not found.
        </div>
      )}
    </div>
  );
} 