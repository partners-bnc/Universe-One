export function substitute(templateStr: string, lead: Record<string, unknown>) {
  if (!templateStr) return "";
  
  const getNormalizedValue = (key: string) => {
    const norm = key.toLowerCase().replace(/[\s_\-]+/g, '');
    
    switch (norm) {
      // Name mappings
      case 'contactname':
      case 'fullname':
      case 'leadname':
      case 'name':
        return String(lead.full_name || "") || '';
      case 'firstname':
        return lead.full_name ? String(lead.full_name).split(' ')[0] : '';
        
      // Company mappings
      case 'companyname':
      case 'company':
        return lead.company_name || '';
        
      // Agent / Assigned to mappings
      case 'agentname':
      case 'agent':
      case 'assignedto':
        return lead.assigned_to || 'Sales Team';
        
      // Product
      case 'productname':
      case 'product':
        return lead.product_name || lead.product || 'Enterprise Audit Package';
        
      // Estimated Value / Currency
      case 'estimatedvalue':
      case 'value':
        return lead.estimated_value || lead.value || '$10,000';
      case 'currency':
        return lead.currency || 'USD';
        
      // Followup Date
      case 'followupdate':
      case 'nextfollowupdate':
        return lead.next_followup_date || 'May 28, 2026';
        
      // Contact info
      case 'phone':
      case 'phonenumber':
        return lead.phone || '';
      case 'email':
      case 'emailaddress':
        return lead.email || '';
        
      // Other Lead fields
      case 'leadsource':
      case 'source':
        return lead.lead_source || '';
      case 'leadstatus':
      case 'status':
        return lead.lead_status || '';
      case 'priority':
        return lead.priority || '';
      case 'designation':
        return lead.designation || '';
      case 'industry':
        return lead.industry || '';
        
      default:
        // Try looking up the property directly on lead
        if (lead[key] !== undefined) return String(lead[key]);
        const cleanKey = key.replace(/[\s_\-]+/g, '_').toLowerCase();
        if (lead[cleanKey] !== undefined) return String(lead[cleanKey]);
        return null;
    }
  };

  return templateStr.replace(/\{\{\s*([a-zA-Z0-9_\s\-]+?)\s*\}\}/g, (match, key) => {
    const val = getNormalizedValue(key);
    return val !== null ? String(val) : match;
  });
}

