% VLSI Homework 1 Problem 2
% David Sheppard
% 10/1/2019

% Plot Ids vs. Vds for varying Vgs values

% Given:
W_over_L = 2;                   % unitless
mobility = 350;                 % (cm^2)/(V*s)
Vt = 0.7;                       % V
Vds = 0:0.01:5;                 % V
tox = 10e-8;                    % cm
Vgs = [0 1 2 3 4 5];            % V
Eox = 8.85 * 10e-14;            % F/cm

% Derived:
Cox = Eox / tox;                % F
beta = mobility * Cox * W_over_L;    % F*(cm^2)/(V*s)

% initialize Ids for testing:
Ids = zeros(1,length(Vds));             % A

% open figure
figure(1);
for i=1:length(Vgs)     % iterate for Vgs values
    
    for j=1:length(Vds) % iterate for Vds values
        
        % if in Cutoff
        if (Vgs(i) < Vt)
            Ids(j) = 0;
            
        % if in Linear Region
        elseif(Vds(j) < Vgs(i) - Vt)
            Ids(j) = beta * (Vgs(i) - Vt - (Vds(j)/2)) * Vds(j);
            
        % if in Saturation Region:
        else
            Ids(j) = (beta/2) * (Vgs(i)-Vt)^2;
            
        end
        
        % convert to mA
        Ids(j) = Ids(j) * 1000;
        
    end
    
    % plot the series
    plot(Vds, Ids, 'Linewidth', 2);
    hold on;    % wait for other series
end

% formatting plot
title('I_{ds} vs V_{ds}');
grid();
xlabel('V_{ds} (V)');
ylabel('I_{ds} (mA)');
legend({'V_{gs}=0 V','V_{gs}=1 V', 'V_{gs}=2 V',...
    'V_{gs}=3 V','V_{gs}=4 V', 'V_{gs}=5 V'},'Location','northwest')
hold off;

