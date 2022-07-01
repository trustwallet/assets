package processor

import (
	"testing"

	"github.com/trustwallet/go-libs/blockchain/binance"
	"github.com/trustwallet/go-primitives/coin"
)

func Test_getTokenName(t *testing.T) {
	type args struct {
		t binance.Token
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "BNB wrong name",
			args: args{t: binance.Token{
				Name:   "Binance Chain Native Token",
				Symbol: coin.Binance().Symbol,
			}},
			want: "BNB Beacon Chain",
		},
		{
			name: "BNB correct name",
			args: args{t: binance.Token{
				Name:   "BNB Beacon Chain",
				Symbol: coin.Binance().Symbol,
			}},
			want: "BNB Beacon Chain",
		},
		{
			name: "Regular token",
			args: args{t: binance.Token{
				Name:   "Test",
				Symbol: "TEST",
			}},
			want: "Test",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getTokenName(tt.args.t); got != tt.want {
				t.Errorf("getTokenName() = %v, want %v", got, tt.want)
			}
		})
	}
}
